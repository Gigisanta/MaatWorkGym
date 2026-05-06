"use client";
import { useState } from "react";
import { X, Layers, Loader2, CheckCircle2 } from "lucide-react";

type PlanType = { id?: string; nombre: string; duracionDias: number; precio: number };

interface PlanModalProps {
  plan?: PlanType | null;
  onClose: () => void;
  onSave: (data: { nombre: string; duracionDias: number; precio: number }) => void;
  isLoading: boolean;
}

export function PlanModal({ plan, onClose, onSave, isLoading }: PlanModalProps) {
  const [formData, setFormData] = useState({
    nombre: plan?.nombre || "",
    duracionDias: plan?.duracionDias || 30,
    precio: plan?.precio || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center"><Layers className="w-5 h-5" /></div>
                <div><h2 className="text-lg font-bold">{plan ? "Editar Plan" : "Nuevo Plan"}</h2>{plan && <p className="text-sm text-[var(--text-secondary)]">{plan.nombre}</p>}</div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nombre del Plan <span className="text-red-400">*</span></label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: Plan Mensual" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Duración (días) <span className="text-red-400">*</span></label>
              <input type="number" value={formData.duracionDias} onChange={(e) => setFormData((prev) => ({ ...prev, duracionDias: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: 30" min="1" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Precio ($) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                <input type="number" value={formData.precio} onChange={(e) => setFormData((prev) => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))} className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: 5000" min="0" step="0.01" required />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors font-medium">Cancelar</button>
              <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>) : (<><CheckCircle2 className="w-4 h-4" /> {plan ? "Guardar" : "Crear Plan"}</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

