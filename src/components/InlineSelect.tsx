'use client';

import { useState, useRef, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';

interface InlineSelectProps<T extends string> {
  value: T;
  options: T[];
  onSave: (value: T) => Promise<void>;
  renderBadge: (value: T) => React.ReactNode;
  disabled?: boolean;
}

export default function InlineSelect<T extends string>({
  value,
  options,
  onSave,
  renderBadge,
  disabled,
}: InlineSelectProps<T>) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as T;
    if (next === value) { setEditing(false); return; }
    setSaving(true);
    setEditing(false);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-400">
        <FiLoader className="w-3.5 h-3.5 animate-spin" />
        <span className="text-xs">Saving…</span>
      </span>
    );
  }

  if (editing) {
    return (
      <select
        ref={selectRef}
        defaultValue={value}
        onChange={handleChange}
        onBlur={() => setEditing(false)}
        className="text-xs border border-blue-400 rounded-lg px-2 py-1 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && setEditing(true)}
      title="Click to edit"
      className="group relative inline-flex items-center gap-1 cursor-pointer disabled:cursor-default"
    >
      {renderBadge(value)}
      {!disabled && (
        <span className="absolute -top-1 -right-4 text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium select-none">
          ✎
        </span>
      )}
    </button>
  );
}
