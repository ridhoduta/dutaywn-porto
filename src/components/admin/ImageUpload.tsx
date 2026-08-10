"use client";

import React, { useRef, useState } from "react";
import { validateImageFile, uploadImage, StorageBucket } from "@/lib/supabase/storage";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  bucket: StorageBucket;
  folder?: string;
  disabled?: boolean;
  preview?: boolean;
  helperText?: string;
}

export function ImageUpload({
  label = "Upload Image",
  value,
  onChange,
  bucket,
  folder,
  disabled = false,
  preview = true,
  helperText,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setLoading(false);
        return;
      }

      // Create preview
      if (preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Upload file
      const result = await uploadImage(file, bucket, folder);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        onChange(result.data.publicUrl);
        setPreviewUrl(result.data.publicUrl);
      }
    } finally {
      setLoading(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="flex gap-4">
        {/* Preview */}
        {previewUrl && preview && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                onChange("");
              }}
              disabled={loading}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading || disabled}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading || disabled}
            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                📤 Click to upload image
              </span>
            )}
          </button>

          {helperText && (
            <p className="mt-1 text-xs text-slate-500">{helperText}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
