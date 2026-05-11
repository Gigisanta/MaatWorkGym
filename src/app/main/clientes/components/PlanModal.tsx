'use client';
import { useState } from 'react';
import { X, Layers, Loader2, CheckCircle2 } from 'lucide-react';

type PlanType = { id?: string; nombre: string; duracionDias: number; precio: number };

interface PlanModalProps {
  plan?: PlanType | null;
  onClose: () => void;
  onSave: (data: { nombre: string; duracionDias: number; precio: number }) => void;
  isLoading: boolean;
}

export function PlanModal({ plan, onClose, onSave, isLoading }: PlanModalProps) {
  const [formData, setFormData] = useState({
    nombre: plan?.nombre || '',
    duracionDias: plan?.duracionDias || 30,
    precio: plan?.precio || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} role="presentation" />
      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{plan ? 'Editar Plan' : 'Nuevo Plan'}</h2>
                  {plan && <p className="text-sm text-muted-foreground">{plan.nombre}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="plan-nombre" className="text-sm font-medium text-foreground">
                Nombre del Plan <span className="text-destructive">*</span>
              </label>
              <input
                id="plan-nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                placeholder="Ej: Plan Mensual"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="plan-duracion" className="text-sm font-medium text-foreground">
                Duración (días) <span className="text-destructive">*</span>
              </label>
              <input
                id="plan-duracion"
                type="number"
                value={formData.duracionDias}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duracionDias: parseInt(e.target.value) || 0 }))
                }
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                placeholder="Ej: 30"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="plan-precio" className="text-sm font-medium text-foreground">
                Precio ($) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  id="plan-precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                  placeholder="Ej: 5000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> {plan ? 'Guardar' : 'Crear Plan'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
