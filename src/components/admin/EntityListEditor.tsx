"use client";

import { useRef, useState } from "react";
import { Button, Input, Textarea } from "@/components/admin";
import {
  STORAGE_BUCKETS,
  uploadImage,
  validateImageFile,
  type StorageBucket,
} from "@/lib/supabase/storage";

export type EntityField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "image";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  bucket?: StorageBucket;
  folder?: string;
  helperText?: string;
};

export type EntityConfig = {
  title: string;
  icon: string;
  fields: EntityField[];
};

export type EntityItem = Record<string, unknown>;

interface EntityListEditorProps {
  config: EntityConfig;
  items: EntityItem[];
  onChange: (items: EntityItem[]) => void;
}

function EntityImageUpload({
  label,
  value,
  required,
  helperText,
  bucket = STORAGE_BUCKETS.DOCUMENTS,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  helperText?: string;
  bucket?: StorageBucket;
  folder?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadImage(file, bucket, folder);
      if (result.error) {
        setError(result.error);
      } else if (result.data?.publicUrl) {
        onChange(result.data.publicUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        <div className="flex gap-4 items-start">
          {value && (
            <div className="relative group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200 bg-slate-50"
              />
              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 shadow"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-1">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-700 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span>⏳ Uploading...</span>
              ) : (
                <span>📤 {value ? "Replace image" : "Upload image"}</span>
              )}
            </button>

            {helperText && (
              <p className="mt-1 text-xs text-slate-500">{helperText}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export function EntityListEditor({ config, items, onChange }: EntityListEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = () => {
    const newItem: EntityItem = { sort_order: items.length };
    config.fields.forEach((field) => {
      newItem[field.name] = "";
    });
    onChange([...items, newItem]);
    setEditingIndex(items.length);
    setIsOpen(true);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const deleteItem = (index: number) => {
    if (!confirm(`Delete this ${config.title.toLowerCase()}?`)) return;
    onChange(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange(newItems.map((item, i) => ({ ...item, sort_order: i })));
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange(newItems.map((item, i) => ({ ...item, sort_order: i })));
  };

  const toggleEdit = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const getFieldValue = (item: EntityItem, fieldName: string): string => {
    const value = item[fieldName];
    return typeof value === "string" ? value : String(value || "");
  };

  const renderField = (field: EntityField, item: EntityItem, index: number) => {
    const value = getFieldValue(item, field.name);

    if (field.type === "image") {
      return (
        <EntityImageUpload
          key={field.name}
          label={field.label}
          value={value}
          required={field.required}
          helperText={field.helperText || "Max 5MB (JPG, PNG, WEBP, GIF)"}
          bucket={field.bucket || STORAGE_BUCKETS.DOCUMENTS}
          folder={field.folder}
          onChange={(url) => updateItem(index, field.name, url)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.name}
          label={field.label}
          value={value}
          onChange={(e) => updateItem(index, field.name, e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          required={field.required}
        />
      );
    }

    if (field.type === "select" && field.options) {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => updateItem(index, field.name, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <Input
        key={field.name}
        label={field.label}
        value={value}
        onChange={(e) => updateItem(index, field.name, e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  };

  const renderPreview = (item: EntityItem) => {
    const firstField = config.fields[0];
    const secondField = config.fields[1];
    const imageField = config.fields.find(
      (f) => f.type === "image" || f.name === "image_url"
    );
    const imageUrl = imageField ? getFieldValue(item, imageField.name) : "";

    return (
      <div className="flex items-start gap-3">
        {imageUrl && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Thumbnail"
              className="w-14 h-14 rounded-md object-cover border border-slate-200 bg-slate-100"
            />
          </div>
        )}
        <div className="text-sm flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {getFieldValue(item, firstField.name) || `(No ${firstField.label.toLowerCase()})`}
          </p>
          {secondField && secondField !== imageField && (
            <p className="text-slate-600 mt-1 line-clamp-2 text-xs">
              {getFieldValue(item, secondField.name) || `(No ${secondField.label.toLowerCase()})`}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1 text-left hover:text-slate-900 transition-colors"
        >
          <span className="text-lg">{isOpen ? "▼" : "▶"}</span>
          <span className="text-base">{config.icon}</span>
          <h4 className="font-semibold text-slate-900">{config.title}</h4>
          <span className="text-sm text-slate-500">({items.length})</span>
        </button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            addItem();
          }}
        >
          + Add
        </Button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No {config.title.toLowerCase()} yet.</p>
              <p className="text-xs mt-1">Click &quot;Add&quot; to create the first one.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
              >
                {/* Item Header */}
                <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-slate-200">
                  <span className="font-medium text-sm text-slate-700">
                    {config.title} #{index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === items.length - 1}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleEdit(index)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium"
                    >
                      {editingIndex === index ? "✓ Done" : "✏️ Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-4">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      {config.fields.map((field) => renderField(field, item, index))}
                    </div>
                  ) : (
                    renderPreview(item)
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
