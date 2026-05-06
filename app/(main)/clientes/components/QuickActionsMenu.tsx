"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, RefreshCw, Bell } from "lucide-react";

interface QuickActionsMenuProps {
  onView: () => void;
  onEdit: () => void;
  onRenew: () => void;
  onNotify: () => void;
}

export function QuickActionsMenu({ onView, onEdit, onRenew, onNotify }: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        aria-label="Menú de acciones"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl overflow-hidden">
          <button
            onClick={() => handleAction(onView)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Eye className="w-4 h-4 text-violet-400" />
            Ver perfil
          </button>
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
            Editar cliente
          </button>
          <button
            onClick={() => handleAction(onRenew)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Renovar membresía
          </button>
          <button
            onClick={() => handleAction(onNotify)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            Enviar notificación
          </button>
        </div>
      )}
    </div>
  );
}