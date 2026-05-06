"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SmartSearchBar({ value, onChange, placeholder = "Buscar por nombre, apellido o DNI..." }: SmartSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] focus:border-violet-500/40 focus:outline-none transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        style={{ paddingLeft: "2.75rem" }}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      )}
    </div>
  );
}
