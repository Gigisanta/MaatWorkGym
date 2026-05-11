'use client';

import { SocioConEstado } from '../types/client';
import { MembershipStatusDot, getMembershipStatus } from './MembershipStatusDot';
import { ObjectiveBadges } from './ObjectiveBadges';
import { QuickActionsMenu } from './QuickActionsMenu';
import { ChevronDown, Phone, Calendar, Target, Activity, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRUPO_MUSCULAR_LABELS, GrupoMuscularType } from '../types/client';
import { cn } from '@/lib/utils';

interface ClientCompactRowProps {
  socio: SocioConEstado;
  onView: () => void;
  onEdit: () => void;
  onRenew: () => void;
  onNotify: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre[0] || ''}${apellido[0] || ''}`.toUpperCase();
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getVencimiento(socio: SocioConEstado): string {
  if (!socio.venceEn) return 'Sin datos';
  if (socio.venceEn < 0) return `Vencida hace ${Math.abs(socio.venceEn)} días`;
  return `Vence en ${socio.venceEn} días`;
}

export function ClientCompactRow({
  socio,
  onView,
  onEdit,
  onRenew,
  onNotify,
  isExpanded,
  onToggleExpand,
}: ClientCompactRowProps) {
  const status = getMembershipStatus(socio.venceEn);
  const initials = getInitials(socio.nombre, socio.apellido);

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        isExpanded ? "bg-muted/50 shadow-md" : "hover:bg-muted/30"
      )}
    >
      <div
        className="flex items-center gap-4 p-4 cursor-pointer group"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggleExpand()}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0 bg-gradient-to-br from-primary to-amber-400 group-hover:scale-105 transition-transform"
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate text-sm">
              {socio.apellido}, {socio.nombre}
            </span>
            <MembershipStatusDot status={status} size="sm" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{socio.plan.nombre}</span>
            <span className="text-muted-foreground/30 text-xs">•</span>
            <span className={cn(
              "text-xs font-medium",
              status === 'vencida' ? "text-destructive" : status === 'porVencer' ? "text-warning" : "text-success"
            )}>
              {getVencimiento(socio)}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {socio.objetivoCliente && <ObjectiveBadges objetivo={socio.objetivoCliente} />}
        </div>

        <QuickActionsMenu onView={onView} onEdit={onEdit} onRenew={onRenew} onNotify={onNotify} />

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 p-1.5 rounded-lg bg-muted text-muted-foreground"
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-border mt-2">
              {socio.telefono && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-sm font-medium text-foreground truncate">{socio.telefono}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Dumbbell size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Enfoque</p>
                  <p className="text-sm font-medium text-foreground truncate capitalize">
                    {socio.grupoMuscular ? (GRUPO_MUSCULAR_LABELS[socio.grupoMuscular as GrupoMuscularType] || socio.grupoMuscular) : 'No asignado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                  <Activity size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Visitas Mes</p>
                  <p className="text-sm font-medium text-foreground">{socio.visitasMesActual || 0} Sesiones</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
