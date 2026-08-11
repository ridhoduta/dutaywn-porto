"use client";

import React, { useRef, useState } from "react";
import { validateImageFile, uploadImage, StorageBucket } from "@/lib/supabase/storage";

interface MultipleImageUploadProps {
  label?: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  bucket: StorageBucket;
  folder?: string;
  disabled?: boolean;
  preview?: boolean;
  helperText?: string;
  maxFiles?: number;
}

export function MultipleImageUpload({
  label = "Upload Images",
  value = [],
  onChange,
  bucket,
  folder,
  disabled = false,
  preview = true,
  helperText,
  maxFiles = 5,
}: MultipleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || "Invalid file");
          continue; // skip this file and try next
        }

        // Upload file
        const result = await uploadImage(file, bucket, folder);

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          newUrls.push(result.data.publicUrl);
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
    } finally {
      setLoading(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newValues = value.filter((_, index) => index !== indexToRemove);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label} {value.length > 0 && `(${value.length}/${maxFiles})`}
        </label>
      )}

      <div className="flex flex-col gap-4">
        {/* Upload Area */}
        {value.length < maxFiles && (
          <div className="w-full">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
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
                  📤 Click to upload image(s)
                </span>
              )}
            </button>

            {helperText && (
              <p className="mt-1 text-xs text-slate-500">{helperText}</p>
            )}
          </div>
        )}

        {/* Preview Area */}
        {preview && value.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {value.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={loading}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
