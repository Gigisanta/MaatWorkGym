'use client';

import { motion } from 'framer-motion';
import { Sparkles, Phone, Cake, Activity, Check, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { getAvatarColor, getInitials } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface SocioInfo {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string | null;
  fechaNacimiento?: Date | string | null;
  tieneDeuda: boolean;
  visitasMesActual?: number;
  plan: { nombre: string };
}

interface MemberCardProps {
  socio: SocioInfo;
  isFichado?: boolean;
  isSearching?: boolean;
  onFichar?: () => void;
}

function calculateAge(fechaNacimiento: Date | string | null | undefined): number | null {
  if (!fechaNacimiento) return null;
  const today = new Date();
  const birth = new Date(fechaNacimiento);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MemberCard({ socio, isFichado = false, isSearching = false }: MemberCardProps) {
  const { bg, accent } = getAvatarColor(`${socio.nombre} ${socio.apellido}`);
  const initials = getInitials(`${socio.nombre} ${socio.apellido}`);

  if (isFichado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full"
      >
        <div className="p-10 rounded-[3rem] bg-success/5 border border-success/20 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-success/50 to-transparent" />

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 12 }}
            className="w-24 h-24 rounded-[2.5rem] bg-success/10 flex items-center justify-center mb-8 border border-success/20 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
          >
            <Check size={48} className="text-success" />
          </motion.div>

          <div className="space-y-2 mb-8">
            <h3 className="text-4xl font-black text-foreground tracking-tighter uppercase">¡Acceso Exitoso!</h3>
            <p className="text-xl font-bold text-muted-foreground tracking-tight">Bienvenido/a, {socio.nombre}</p>
          </div>

          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-success">Registrado a las {formatTime(new Date())}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-gym-bg-surface border border-gym-border rounded-[3rem] p-10 relative overflow-hidden group">
        {/* Glow Effect */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-opacity duration-500 opacity-20"
          style={{ backgroundColor: accent }}
        />

        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div
            className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-2xl relative"
            style={{ backgroundColor: bg, color: accent }}
          >
            {initials}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gym-bg-base border border-gym-border flex items-center justify-center">
              <Zap size={14} className="text-warning" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-foreground tracking-tighter truncate">
                {socio.nombre} {socio.apellido}
              </h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              ID PERFIL: {socio.dni}
            </p>
          </div>
          <StatusBadge tieneDeuda={socio.tieneDeuda} />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <InfoCard
            icon={<Sparkles size={14} />}
            label="Plan Actual"
            value={socio.plan.nombre}
            className="bg-primary/5 border-primary/10"
            valueClassName="text-primary"
          />
          <InfoCard
            icon={<Activity size={14} />}
            label="Asistencia"
            value={`${socio.visitasMesActual || 0} Visitas`}
          />
          {socio.fechaNacimiento && (
            <InfoCard
              icon={<Cake size={14} />}
              label="Edad"
              value={`${calculateAge(socio.fechaNacimiento)} Años`}
            />
          )}
          {socio.telefono && (
            <InfoCard
              icon={<Phone size={14} />}
              label="Contacto"
              value={socio.telefono}
            />
          )}
        </div>

        {/* Search State */}
        {isSearching && (
          <div className="flex items-center justify-center gap-4 py-6 rounded-[2rem] bg-muted border border-border">
            <div className="relative">
              <div className="w-5 h-5 rounded-full border-2 border-primary/20 animate-pulse" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Sincronizando acceso...
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

function InfoCard({ icon, label, value, className, valueClassName }: InfoCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-[2rem] bg-gym-bg-elevated border border-gym-border flex flex-col gap-2 transition-all duration-300 hover:bg-gym-bg-surface",
      className
    )}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className={cn("text-sm font-black text-foreground/90 truncate", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

interface StatusBadgeProps {
  tieneDeuda: boolean;
}

export function StatusBadge({ tieneDeuda }: StatusBadgeProps) {
  return (
    <div className={cn(
      "px-6 py-3 rounded-[1.5rem] border flex items-center gap-2 shadow-xl",
      tieneDeuda
        ? "bg-destructive/10 border-destructive/20 text-destructive shadow-destructive/5"
        : "bg-success/10 border-success/20 text-success shadow-success/5"
    )}>
      {tieneDeuda ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {tieneDeuda ? 'Deuda Pendiente' : 'Socio al Día'}
      </span>
    </div>
  );
}
