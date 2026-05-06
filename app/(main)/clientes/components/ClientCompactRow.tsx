"use client";

import { SocioConEstado } from "../types/client";
import { MembershipStatusDot, getMembershipStatus } from "./MembershipStatusDot";
import { ObjectiveBadges } from "./ObjectiveBadges";
import { QuickActionsMenu } from "./QuickActionsMenu";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GRUPO_MUSCULAR_LABELS, GrupoMuscularType } from "../types/client";

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
  return `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase();
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getVencimiento(socio: SocioConEstado): string {
  if (!socio.venceEn) return "Sin datos";
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
    <div className="border-l-2" style={{ borderLeftColor: status === "vigente" ? "#2ECC8F" : status === "porVencer" ? "#F59E0B" : "#E8514A" }}>
      <div
        className="flex items-center gap-3 p-3 rounded-r-xl hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--text-primary)] truncate">
              {socio.apellido}, {socio.nombre}
            </span>
            <MembershipStatusDot status={status} size="sm" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[var(--text-secondary)]">{socio.plan.nombre}</span>
            <span className="text-xs text-[var(--text-secondary)]">•</span>
            <span className="text-xs text-[var(--text-secondary)]">{getVencimiento(socio)}</span>
          </div>
        </div>

        {socio.objetivoCliente && (
          <ObjectiveBadges objetivo={socio.objetivoCliente} />
        )}

        <QuickActionsMenu
          onView={onView}
          onEdit={onEdit}
          onRenew={onRenew}
          onNotify={onNotify}
        />

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pl-14 space-y-2">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {socio.telefono && (
                  <span className="text-[var(--text-secondary)]">Tel: {socio.telefono}</span>
                )}
                {socio.grupoMuscular && (
                  <span className="text-[var(--text-secondary)]">
                    Grupo: {GRUPO_MUSCULAR_LABELS[socio.grupoMuscular as GrupoMuscularType] || socio.grupoMuscular}
                  </span>
                )}
                {socio.horarioEntrenamiento && (
                  <span className="text-[var(--text-secondary)] capitalize">
                    Horario: {socio.horarioEntrenamiento}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="text-[var(--text-secondary)]">
                  Inicio: {formatDate(socio.fechaInicio)}
                </span>
                {socio.visitasMesActual !== undefined && (
                  <span className="text-[var(--text-secondary)]">
                    Visitas: {socio.visitasMesActual}
                  </span>
                )}
              </div>
              {socio.objetivoCliente && (
                <p className="text-sm text-violet-400 italic">Objetivo: {socio.objetivoCliente}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}