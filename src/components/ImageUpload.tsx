'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiImage, FiPlus } from 'react-icons/fi';

interface ImageEntry {
  /** For existing saved images — a remote URL */
  url?: string;
  /** For newly picked files — an object URL for preview */
  preview?: string;
  file?: File;
}

interface ImageUploadProps {
  /** Already-saved image URLs (from the DB) */
  existingUrls?: string[];
  /** Called whenever the list changes; returns new File[] to upload + kept URL strings */
  onChange: (newFiles: File[], keptUrls: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export default function ImageUpload({
  existingUrls = [],
  onChange,
  disabled,
  maxImages = 10,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Build initial entries from existing URLs
  const [entries, setEntries] = useState<ImageEntry[]>(
    existingUrls.map((url) => ({ url }))
  );

  const notify = useCallback(
    (next: ImageEntry[]) => {
      const newFiles = next.flatMap((e) => (e.file ? [e.file] : []));
      const keptUrls = next.flatMap((e) => (e.url ? [e.url] : []));
      onChange(newFiles, keptUrls);
    },
    [onChange]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!arr.length) return;

      setEntries((prev) => {
        const remaining = maxImages - prev.length;
        const toAdd = arr.slice(0, remaining).map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        const next = [...prev, ...toAdd];
        notify(next);
        return next;
      });
    },
    [maxImages, notify]
  );

  const removeEntry = (index: number) => {
    setEntries((prev) => {
      const entry = prev[index];
      if (entry.preview) URL.revokeObjectURL(entry.preview);
      const next = prev.filter((_, i) => i !== index);
      notify(next);
      return next;
    });
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const canAddMore = entries.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Thumbnails grid */}
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {entries.map((entry, i) => {
            const src = entry.preview ?? entry.url!;
            return (
              <div
                key={i}
                className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeEntry(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-white bg-black/40 py-0.5">
                  {i + 1}/{entries.length}
                </span>
              </div>
            );
          })}

          {/* Inline "add more" tile */}
          {canAddMore && !disabled && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
            >
              <FiPlus className="w-5 h-5" />
              <span className="text-xs">Add more</span>
            </button>
          )}
        </div>
      )}

      {/* Drop zone — only shown when no images yet */}
      {entries.length === 0 && (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed transition-colors cursor-pointer
            ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          <div className="p-3 bg-blue-100 rounded-full">
            <FiImage className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drop images here, or{' '}
              <span className="text-blue-600">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              PNG, JPG, GIF, WebP — up to {maxImages} images, 10 MB each
            </p>
          </div>
          <FiUpload className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {entries.length > 0 && (
        <p className="text-xs text-gray-400">
          {entries.length} / {maxImages} images •{' '}
          <span className="text-gray-500">hover a thumbnail to remove it</span>
        </p>
      )}
    </div>
  );
}
