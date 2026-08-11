"use client";

import React, { useRef, useState } from "react";
import { validateImageFile, StorageBucket } from "@/lib/supabase/storage";

interface MultipleImageUploadProps {
  label?: string;
  /** Committed public URLs (from DB) — shown when editing an existing record */
  value?: string[];
  /** Called with updated File list whenever files are added or removed */
  onFileSelect: (files: File[]) => void;
  bucket: StorageBucket;
  folder?: string;
  disabled?: boolean;
  preview?: boolean;
  helperText?: string;
  maxFiles?: number;
}

interface PendingImage {
  file: File;
  objectUrl: string;
}

export function MultipleImageUpload({
  label = "Upload Images",
  value = [],
  onFileSelect,
  disabled = false,
  preview = true,
  helperText,
  maxFiles = 5,
}: MultipleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingImage[]>([]);

  // Total slots used = committed URLs + pending files
  const totalCount = value.length + pending.length;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (totalCount + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError(null);

    const newPending: PendingImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        continue;
      }
      newPending.push({ file, objectUrl: URL.createObjectURL(file) });
    }

    if (newPending.length > 0) {
      const updated = [...pending, ...newPending];
      setPending(updated);
      onFileSelect(updated.map((p) => p.file));
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemovePending = (index: number) => {
    URL.revokeObjectURL(pending[index].objectUrl);
    const updated = pending.filter((_, i) => i !== index);
    setPending(updated);
    onFileSelect(updated.map((p) => p.file));
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label} {totalCount > 0 && `(${totalCount}/${maxFiles})`}
        </label>
      )}

      <div className="flex flex-col gap-4">
        {/* Upload trigger */}
        {totalCount < maxFiles && (
          <div className="w-full">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
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
                📤 Click to select image(s)
              </span>
            </button>

            {helperText && (
              <p className="mt-1 text-xs text-slate-500">{helperText}</p>
            )}
          </div>
        )}

        {/* Preview area */}
        {preview && (value.length > 0 || pending.length > 0) && (
          <div className="flex flex-wrap gap-4 mt-2">
            {/* Committed URLs (already uploaded, shown read-only) */}
            {value.map((url, index) => (
              <div key={`committed-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Saved image ${index + 1}`}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-blue-200"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-blue-600/70 text-white text-xs text-center py-0.5 rounded-b-lg">
                  saved
                </span>
              </div>
            ))}

            {/* Pending files (local preview, will upload on submit) */}
            {pending.map((p, index) => (
              <div key={`pending-${index}`} className="relative group">
                <img
                  src={p.objectUrl}
                  alt={`Pending image ${index + 1}`}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-amber-300"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-amber-500/70 text-white text-xs text-center py-0.5 rounded-b-lg">
                  pending
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePending(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
