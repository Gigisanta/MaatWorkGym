"use client";
import { useState } from "react";
import { X, DollarSign, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface PagoModalProps {
  socioId: string;
  onClose: () => void;
  onSave: (data: { monto: string; metodo: "efectivo" | "transferencia"; mes: number; anio: number }) => void;
  isLoading: boolean;
}

export function PagoModal({ socioId, onClose, onSave, isLoading }: PagoModalProps) {
  const [formData, setFormData] = useState({
    monto: "",
    metodo: "efectivo" as "efectivo" | "transferencia",
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
                <div><h2 className="text-lg font-bold">Registrar Pago</h2><p className="text-sm text-[var(--text-secondary)]">Complete los datos del pago</p></div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Monto ($) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                <input type="number" value={formData.monto} onChange={(e) => setFormData((prev) => ({ ...prev, monto: e.target.value }))} className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: 5000" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, metodo: "efectivo" }))} className={`p-3 rounded-xl border transition-all ${formData.metodo === "efectivo" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"}`}>
                  <DollarSign className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Efectivo</span>
                </button>
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, metodo: "transferencia" }))} className={`p-3 rounded-xl border transition-all ${formData.metodo === "transferencia" ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"}`}>
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Transferencia</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mes</label>
                <select value={formData.mes} onChange={(e) => setFormData((prev) => ({ ...prev, mes: parseInt(e.target.value) }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                  {MESES.map((mes, i) => (<option key={i} value={i + 1}>{mes}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Año</label>
                <select value={formData.anio} onChange={(e) => setFormData((prev) => ({ ...prev, anio: parseInt(e.target.value) }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors font-medium">Cancelar</button>
            <button onClick={() => onSave(formData)} disabled={isLoading || !formData.monto} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>) : (<><CheckCircle2 className="w-4 h-4" /> Confirmar</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

