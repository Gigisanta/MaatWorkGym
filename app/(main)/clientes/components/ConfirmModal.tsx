"use client";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  confirmText?: string;
  variant?: "danger" | "warning";
}

export function ConfirmModal({ title, message, onConfirm, onCancel, isLoading, confirmText = "Eliminar", variant = "danger" }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
          <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${variant === "danger" ? "bg-red-500/10" : "bg-amber-500/10"}`}>
              {variant === "danger" ? <Trash2 className="w-8 h-8 text-red-400" /> : <AlertTriangle className="w-8 h-8 text-amber-400" />}
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)] text-sm">{message}</p>
          </div>
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50 flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors font-medium">Cancelar</button>
            <button onClick={onConfirm} disabled={isLoading} className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${variant === "danger" ? "bg-red-600 hover:bg-red-500 text-white" : "bg-amber-600 hover:bg-amber-500 text-white"}`}>
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</>) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

