// src/components/VideoUpload.jsx
import React, { useState, useRef } from "react";

export default function VideoUpload({
  value = [],
  onChange = () => {},
  maxFiles = 2,
  maxSizeMB = 50,
  accept = "video/*",
  label = "Upload video(s) (mp4/webm)",
}) {
  const [files, setFiles] = useState(value || []);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const updateFiles = (next) => {
    setFiles(next);
    onChange(next);
  };

  const handleSelect = (e) => {
    setError("");
    const arr = Array.from(e.target.files || []);
    if (!arr.length) return;

    const tooBig = arr.find((f) => f.size / 1024 / 1024 > maxSizeMB);
    if (tooBig) {
      setError(`Each file must be ≤ ${maxSizeMB} MB`);
      return;
    }
    if (files.length + arr.length > maxFiles) {
      setError(`Max ${maxFiles} videos allowed`);
      return;
    }
    updateFiles([...files, ...arr]);
    e.target.value = null;
  };

  const removeAt = (i) => {
    const next = files.filter((_, idx) => idx !== i);
    updateFiles(next);
  };

  return (
    <div>
      <label className="block text-sm text-[var(--muted)] mb-2">Videos</label>
      <div className="rounded bg-[#0f1724] border border-white/8 p-4 flex flex-col gap-3">
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
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleSelect}
          className="hidden"
        />

        {error && <div className="text-xs text-red-400">{error}</div>}

        {files.length === 0 ? (
          <div className="text-[var(--muted)] text-sm py-6 text-center">No videos selected</div>
        ) : (
          <div className="flex flex-col gap-4">
            {files.map((f, i) => (
              <div key={f.name + i} className="border border-white/6 rounded overflow-hidden">
                <video
                  src={URL.createObjectURL(f)}
                  controls
                  className="w-full max-h-[360px] bg-black"
                />
                <div className="p-2 flex items-center justify-between text-xs text-[var(--muted)]">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-[var(--muted)]">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="px-2 py-1 rounded bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
