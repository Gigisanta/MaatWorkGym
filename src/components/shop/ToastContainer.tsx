'use client';

import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUI, type Toast } from '@/context/UIContext';

const ICONS = {
  success: <CheckCircle2 size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
  warning: <AlertTriangle size={18} className="text-amber-400" />,
};

const BG_COLORS = {
  success: 'bg-green-500/10 border-green-500/30',
  error: 'bg-red-500/10 border-red-500/30',
  info: 'bg-blue-500/10 border-blue-500/30',
  warning: 'bg-amber-500/10 border-amber-500/30',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${BG_COLORS[toast.type]} backdrop-blur-sm shadow-xl animate-in slide-in-from-right fade-in duration-300`}
    >
      {ICONS[toast.type]}
      <p className="text-white text-sm flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-white transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
