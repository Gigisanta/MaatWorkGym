"use client";
import { Plus, Layers, Calendar, Edit2, Trash2 } from "lucide-react";

type PlanType = { id: string; nombre: string; duracionDias: number; precio: number; _count?: { socios: number } };

interface PlanesSectionProps {
  planes: PlanType[];
  onCreatePlan: () => void;
  onEditPlan: (plan: PlanType) => void;
  onDeletePlan: (plan: PlanType) => void;
}

export function PlanesSection({ planes, onCreatePlan, onEditPlan, onDeletePlan }: PlanesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Planes</h2>
          <p className="text-[var(--text-secondary)]">Gestiona los planes de membresía</p>
        </div>
        <button onClick={onCreatePlan} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
          <Plus className="w-4 h-4" />Nuevo Plan
        </button>
      </div>

      {planes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <Layers className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
          <h3 className="text-xl font-semibold mb-2">No hay planes</h3>
          <p className="text-[var(--text-secondary)] mb-4">Crea tu primer plan de membresía</p>
          <button onClick={onCreatePlan} className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">Crear Plan</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planes.map((plan) => (
            <div key={plan.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-violet-500/40 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditPlan(plan)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><Edit2 className="w-4 h-4 text-[var(--text-secondary)]" /></button>
                  <button onClick={() => onDeletePlan(plan)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">{plan.nombre}</h3>
              <p className="text-2xl font-bold text-violet-400 mb-2">${plan.precio.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Calendar className="w-4 h-4" />{plan.duracionDias} días</div>
              {plan._count && <div className="mt-4 pt-4 border-t border-[var(--border)]"><span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium">{plan._count.socios} socios activos</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

