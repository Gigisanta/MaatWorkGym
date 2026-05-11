'use client';
import { useState } from 'react';
import { X, DollarSign, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface PagoModalProps {
  socioId: string;
  onClose: () => void;
  onSave: (data: {
    monto: string;
    metodo: 'efectivo' | 'transferencia';
    mes: number;
    anio: number;
  }) => void;
  isLoading: boolean;
}

export function PagoModal({ onClose, onSave, isLoading }: PagoModalProps) {
  const [formData, setFormData] = useState({
    monto: '',
    metodo: 'efectivo' as 'efectivo' | 'transferencia',
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} role="presentation" />
      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Registrar Pago</h2>
                  <p className="text-sm text-muted-foreground">
                    Complete los datos del pago
                  </p>
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

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="pago-monto" className="text-sm font-medium text-foreground">
                Monto ($) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  id="pago-monto"
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monto: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                  placeholder="Ej: 5000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, metodo: 'efectivo' }))}
                  className={cn(
                    "p-3 rounded-lg border transition-all flex flex-col items-center gap-1",
                    formData.metodo === 'efectivo'
                      ? 'bg-success/10 border-success/50 text-success'
                      : 'bg-muted border-border text-muted-foreground hover:border-muted-foreground'
                  )}
                  aria-pressed={formData.metodo === 'efectivo'}
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, metodo: 'transferencia' }))}
                  className={cn(
                    "p-3 rounded-lg border transition-all flex flex-col items-center gap-1",
                    formData.metodo === 'transferencia'
                      ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                      : 'bg-muted border-border text-muted-foreground hover:border-muted-foreground'
                  )}
                  aria-pressed={formData.metodo === 'transferencia'}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Transferencia</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="pago-mes" className="text-sm font-medium text-foreground">Mes</label>
                <select
                  id="pago-mes"
                  value={formData.mes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mes: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all cursor-pointer"
                >
                  {MESES.map((mes, i) => (
                    <option key={i} value={i + 1}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="pago-anio" className="text-sm font-medium text-foreground">Año</label>
                <select
                  id="pago-anio"
                  value={formData.anio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, anio: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>
                    {new Date().getFullYear() - 1}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={isLoading || !formData.monto}
              className="flex-1 py-3 rounded-lg bg-success hover:bg-success/90 text-success-foreground font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
