'use client';
import { Plus, Layers, Calendar, Edit2, Trash2, Users, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type PlanType = {
  id: string;
  nombre: string;
  duracionDias: number;
  precio: number;
  _count?: { socios: number };
};

interface PlanesSectionProps {
  planes: PlanType[];
  onCreatePlan: () => void;
  onEditPlan: (plan: PlanType) => void;
  onDeletePlan: (plan: PlanType) => void;
}

export function PlanesSection({
  planes,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
}: PlanesSectionProps) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Planes de Suscripción</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">Configuración de membresías y tarifas</p>
        </div>
        <button
          onClick={onCreatePlan}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          Nuevo Plan
        </button>
      </div>

      {planes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 rounded-[3rem] glass-card border-dashed border-white/10 flex flex-col items-center justify-center"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 text-muted-foreground/20">
            <Layers size={40} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Sin Planes Activos</h3>
          <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs">
            Comienza configurando tu primer plan de membresía para el gimnasio.
          </p>
          <button
            onClick={onCreatePlan}
            className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
          >
            Crear primer plan
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-[2.5rem] p-8 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20 group-hover:rotate-3 transition-transform">
                  <Layers size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditPlan(plan)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-muted-foreground hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan)}
                    className="p-3 rounded-xl bg-destructive/10 hover:bg-destructive hover:text-white border border-destructive/10 transition-all text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <h3 className="text-2xl font-black text-white mb-2 group-hover:translate-x-1 transition-transform duration-500 tracking-tight">
                  {plan.nombre}
                </h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-primary">${plan.precio.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ Mes</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Vigencia</p>
                      <p className="font-bold text-white text-sm">{plan.duracionDias} Días</p>
                    </div>
                  </div>

                  {plan._count && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
                        <Users size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Suscriptores</p>
                        <p className="font-bold text-white text-sm">{plan._count.socios} Activos</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -right-6 -bottom-6 text-white/[0.01] group-hover:text-white/[0.03] transition-all duration-700 pointer-events-none">
                <Layers size={140} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
