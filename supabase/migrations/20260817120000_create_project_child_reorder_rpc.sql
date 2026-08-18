CREATE OR REPLACE FUNCTION reorder_project_child_entities(
  table_name TEXT,
  project_id_value BIGINT,
  reorder_items JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_tables TEXT[] := ARRAY[
    'project_problems',
    'project_solutions',
    'project_designs',
    'project_features',
    'project_testings',
    'project_results',
    'project_learnings'
  ];
  item JSONB;
  updated_count INTEGER;
BEGIN
  IF NOT table_name = ANY (allowed_tables) THEN
    RAISE EXCEPTION 'Unsupported project child table: %', table_name;
  END IF;

  IF jsonb_typeof(reorder_items) <> 'array' OR jsonb_array_length(reorder_items) = 0 THEN
    RAISE EXCEPTION 'reorder_items must be a non-empty array';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(reorder_items)
  LOOP
    EXECUTE format('UPDATE %I SET sort_order = $1 WHERE id = $2 AND project_id = $3', table_name)
    USING (item->>'sort_order')::INTEGER, (item->>'id')::BIGINT, project_id_value;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    IF updated_count <> 1 THEN
      RAISE EXCEPTION 'Reorder item not found in project: id %', item->>'id';
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION reorder_project_child_entities(TEXT, BIGINT, JSONB) TO authenticated;
