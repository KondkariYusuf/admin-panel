// src/components/TagInput.jsx
import React, { useState, useRef } from "react";

export default function TagInput({
  value = [],                // initial tags array
  onChange = () => {},      // receives updated tags array
  placeholder = "Add a tag",
  maxTags = 10,
}) {
  const [tags, setTags] = useState(Array.isArray(value) ? value : []);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const addTag = (raw) => {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.includes(tag)) return; // avoid duplicates
    if (tags.length >= maxTags) return;
    const next = [...tags, tag];
    setTags(next);
    onChange(next);
    setInput("");
  };

  const removeTag = (idx) => {
    const next = tags.filter((_, i) => i !== idx);
    setTags(next);
    onChange(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "," ) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length) {
      // remove last tag
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-[var(--muted)] mb-2">Tags</label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[48px] w-full flex flex-wrap gap-2 items-center px-3 py-2 rounded bg-[#0f1724] border border-white/10"
      >
        {tags.map((t, i) => (
          <span
            key={t + i}
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/6 text-sm"
          >
            <span className="select-none">{t}</span>
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-xs opacity-70 hover:opacity-100"
              aria-label={`Remove tag ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length >= maxTags ? "" : placeholder}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm py-2"
        />
      </div>

      <div className="mt-2 text-xs text-[var(--muted)]">
        {tags.length}/{maxTags} tags
      </div>
    </div>
  );
}
