import { supabaseClient } from "./client";

/**
 * Storage bucket names for different types of uploads
 */
export const STORAGE_BUCKETS = {
  PROFILES: "profile-images",
  PROJECTS: "project-images",
  CERTIFICATIONS: "certification-images",
  DOCUMENTS: "img-project",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Allowed PDF MIME types
 */
const ALLOWED_PDF_TYPES = [
  "application/pdf",
];

/**
 * Maximum file size in bytes (5MB for images, 10MB for PDFs)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

/**
 * Validation result type
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Upload result type
 */
export interface UploadResult {
  data?: {
    path: string;
    fullPath: string;
    publicUrl: string;
  };
  error?: string;
}

/**
 * Delete result type
 */
export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validate PDF file before upload
 */
export function validatePDFFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  // Check file type
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only PDF files are allowed`,
    };
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_PDF_SIZE / 1024 / 1024}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Generate a unique filename with timestamp and random string
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload an image to Supabase Storage
 *
 * @param file - The image file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with public URL or error
 */
export async function uploadImage(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { error: validation.error };
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filePath = folder ? `${folder}/${filename}` : filename;

    // Upload file to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { error: error.message || "Failed to upload image" };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: publicUrlData.publicUrl,
      },
    };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return {
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

/**
 * Upload a PDF file to Supabase Storage
 *
 * @param file - The PDF file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with public URL or error
 */
export async function uploadPDF(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      return { error: validation.error };
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filePath = folder ? `${folder}/${filename}` : filename;

    // Upload file to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { error: error.message || "Failed to upload PDF" };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: publicUrlData.publicUrl,
      },
    };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return {
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

/**
 * Delete an image from Supabase Storage
 *
 * @param bucket - The storage bucket name
 * @param path - The file path to delete
 * @returns Delete result
 */
export async function deleteImage(
  bucket: StorageBucket,
  path: string
): Promise<DeleteResult> {
  try {
    const { error } = await supabaseClient.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message || "Failed to delete image" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

/**
 * Get public URL for an uploaded image
 *
 * @param bucket - The storage bucket name
 * @param path - The file path
 * @returns Public URL
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extract path from a Supabase Storage public URL
 *
 * @param url - The public URL
 * @param bucket - The storage bucket name
 * @returns The file path or null if not a valid Supabase URL
 */
export function extractPathFromUrl(url: string, bucket: StorageBucket): string | null {
  try {
    const urlObj = new URL(url);
    const pathPattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
    const match = urlObj.pathname.match(pathPattern);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Replace an existing image with a new one
 * Deletes the old image and uploads the new one
 *
 * @param file - The new image file
 * @param bucket - The storage bucket name
 * @param oldUrl - The URL of the old image to delete
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with public URL or error
 */
export async function replaceImage(
  file: File,
  bucket: StorageBucket,
  oldUrl: string | null | undefined,
  folder?: string
): Promise<UploadResult> {
  // Delete old image if it exists and is a Supabase URL
  if (oldUrl) {
    const oldPath = extractPathFromUrl(oldUrl, bucket);
    if (oldPath) {
      await deleteImage(bucket, oldPath);
    }
  }

  // Upload new image
  return uploadImage(file, bucket, folder);
}
