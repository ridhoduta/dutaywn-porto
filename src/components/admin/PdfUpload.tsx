"use client";

import React, { useRef, useState } from "react";
import { validatePDFFile, StorageBucket } from "@/lib/supabase/storage";

interface PdfUploadProps {
  label?: string;
  /** Committed public URL (from DB) — shown when editing an existing record */
  value?: string;
  /** Called with the raw File when the user picks one, or null when cleared */
  onFileSelect: (file: File | null) => void;
  bucket: StorageBucket;
  folder?: string;
  disabled?: boolean;
  helperText?: string;
}

export function PdfUpload({
  label = "Upload PDF",
  value,
  onFileSelect,
  disabled = false,
  helperText,
}: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  // Display name: pending file name takes priority, then derive from committed URL
  const committedName = value ? value.split("/").pop() || "certificate.pdf" : null;
  const displayName = pendingName ?? committedName;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    const validation = validatePDFFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setPendingName(file.name);
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = () => {
    setPendingName(null);
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="flex gap-4">
        {/* PDF badge */}
        {displayName && (
          <div className="relative">
            <div className="w-24 h-24 rounded-lg border-2 border-slate-200 bg-red-50 flex flex-col items-center justify-center">
              <span className="text-3xl mb-1">📄</span>
              <span className="text-xs text-slate-600 text-center px-1 font-medium">PDF</span>
              {pendingName && (
                <span className="text-xs text-amber-600 font-semibold mt-0.5">pending</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
              title="Remove PDF"
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
            accept=".pdf,application/pdf"
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
              📤 {displayName ? "Replace PDF" : "Click to upload PDF"}
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
