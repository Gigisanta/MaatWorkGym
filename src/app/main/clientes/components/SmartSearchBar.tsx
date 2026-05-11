'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SmartSearchBar({
  value,
  onChange,
  placeholder = 'Buscar por nombre, apellido o DNI...',
}: SmartSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      setLocalValue(value);
      previousValueRef.current = value;
    }
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative w-full">
      <div className={cn(
        "flex items-center rounded-lg border transition-all duration-200",
        isFocused
          ? "border-primary/50 bg-background ring-2 ring-primary/10 shadow-sm"
          : "border-input bg-background hover:border-muted-foreground/30"
      )}>
        <div className="pl-4 text-muted-foreground">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={localValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 px-4 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-sm"
          aria-label="Buscar"
        />

        <div className="pr-3 flex items-center gap-2">
          {localValue && (
            <button
              onClick={handleClear}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
            <Sparkles size={10} />
            Smart
          </div>
        </div>
      </div>
    </div>
  );
}
