-- Migration: Remove metric_value and metric_label columns from project_results table

ALTER TABLE public.project_results
  DROP COLUMN IF EXISTS metric_value,
  DROP COLUMN IF EXISTS metric_label;
