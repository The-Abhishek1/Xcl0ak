// hooks/use-upload.ts — CREATE THIS NEW FILE
"use client";
import { useState, useCallback } from "react";

export interface UploadedFile {
  name: string;
  storedAs: string;
  size: number;
  sizeFormatted: string;
  downloadUrl: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const upload = useCallback(async (file: File): Promise<UploadedFile | null> => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const uploaded: UploadedFile = {
        name: data.filename,
        storedAs: data.storedAs,
        size: data.size,
        sizeFormatted: data.sizeFormatted,
        downloadUrl: data.downloadUrl,
      };
      setFiles(prev => [...prev, uploaded]);
      return uploaded;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (fileList: FileList | File[]) => {
    const results: UploadedFile[] = [];
    for (const file of Array.from(fileList)) {
      const result = await upload(file);
      if (result) results.push(result);
    }
    return results;
  }, [upload]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return { upload, uploadMultiple, removeFile, clearFiles, files, uploading, error };
}
