// src/components/ImageUpload.jsx
import React, { useState, useRef, useCallback } from "react";

export default function ImageUpload({
  value = [],                // initial File[] (optional; not file objects in all cases)
  onChange = () => {},      // called with File[] when selection changes
  maxFiles = 6,
  maxSizeMB = 5,
  accept = "image/*",
  label = "Upload images (drag & drop or click)",
}) {
  const [files, setFiles] = useState(value || []);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const fileToPreview = (file) => {
    return URL.createObjectURL(file);
  };

  const updateFiles = (nextFiles) => {
    setFiles(nextFiles);
    onChange(nextFiles);
  };

  const handleFiles = (fileList) => {
    setError("");
    const arr = Array.from(fileList);
    // validate size & count
    const tooBig = arr.find((f) => f.size / 1024 / 1024 > maxSizeMB);
    if (tooBig) {
      setError(`Each file must be ≤ ${maxSizeMB} MB`);
      return;
    }
    const total = files.length + arr.length;
    if (total > maxFiles) {
      setError(`Max ${maxFiles} files allowed`);
      return;
    }
    updateFiles([...files, ...arr]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt?.files?.length) handleFiles(dt.files);
  };

  const onSelect = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = null;
  };

  const removeAt = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    updateFiles(next);
  };

  const clearAll = () => updateFiles([]);

  return (
    <div>
      <label className="block text-sm text-[var(--muted)] mb-2">Images</label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="w-full rounded border border-white/8 bg-[#0f1724] p-4 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--muted)]">{label}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1 rounded bg-white/6 text-sm"
            >
              Choose
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-1 rounded bg-red-600 text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={onSelect}
          className="hidden"
        />

        {error && <div className="text-xs text-red-400">{error}</div>}

        {files.length === 0 ? (
          <div className="py-6 text-center text-[var(--muted)] text-sm">No images selected</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {files.map((f, i) => (
              <div key={f.name + i} className="relative rounded overflow-hidden border border-white/6">
                <img
                  src={fileToPreview(f)}
                  alt={f.name}
                  className="object-cover w-full h-32"
                />
                <div className="p-2 text-xs text-[var(--muted)]">{f.name}</div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
                  aria-label={`Remove ${f.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
