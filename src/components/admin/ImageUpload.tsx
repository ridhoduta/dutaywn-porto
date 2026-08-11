"use client";

import React, { useRef, useState } from "react";
import { validateImageFile, StorageBucket } from "@/lib/supabase/storage";

interface ImageUploadProps {
  label?: string;
  /** Committed public URL (from DB) — shown when editing an existing record */
  value?: string;
  /** Called with the raw File when the user picks one, or null when cleared */
  onFileSelect: (file: File | null) => void;
  bucket: StorageBucket;
  folder?: string;
  disabled?: boolean;
  preview?: boolean;
  helperText?: string;
}

export function ImageUpload({
  label = "Upload Image",
  value,
  onFileSelect,
  disabled = false,
  preview = true,
  helperText,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Local object URL for preview of the pending file
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Build a local blob URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    onFileSelect(file);

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    onFileSelect(null);
    setError(null);
  };

  // Show the local preview first; fall back to the committed URL
  const displayUrl = localPreview ?? value ?? null;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="flex gap-4">
        {/* Preview */}
        {displayUrl && preview && (
          <div className="relative">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
            />
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload trigger */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-700"
          >
            <span className="flex items-center justify-center gap-2">
              📤 {displayUrl ? "Replace image" : "Click to upload image"}
            </span>
          </button>

          {helperText && (
            <p className="mt-1 text-xs text-slate-500">{helperText}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
