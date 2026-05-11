'use client';

import { useState, useCallback, useEffect, useMemo, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  User,
  Check,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  TrendingUp,
  BarChart3,
  Edit3,
  Trash2,
  Play,
} from 'lucide-react';
import {
  useEmpleadoByDni,
  useEmpleadoFichajes,
  useCreateFichaje,
} from '@/hooks/useEmpleadoFichajes';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type FichajeTipo = 'entrada' | 'salida' | 'pausa_inicio' | 'pausa_fin';

interface FichajeDisplay {
  id: string;
  fechaHora: Date;
  tipo: FichajeTipo;
  notas: string | null;
}
interface ShiftInfo {
  entrada: Date | null;
  pausaInicio: Date | null;
  pausaFin: Date | null;
  salida: Date | null;
  estado: 'fuera_turno' | 'en_turno' | 'en_pausa' | 'fuera_horario';
}

// ============================================================================
// Clock Component - Completely isolated with its own timer
// ============================================================================

function ClockDisplay() {
  const [timeString, setTimeString] = useState('00:00:00');
  const [dateString, setDateString] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    let mounted = true;

    const updateClock = () => {
      if (!mounted) return;
      const now = new Date();
      const hours = now.getHours();

      let greet = 'Buenas noches';
      if (hours >= 6 && hours < 12) greet = 'Buenos días';
      else if (hours >= 12 && hours < 18) greet = 'Buenas tardes';

      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      setTimeString(`${hh}:${mm}:${ss}`);
      setDateString(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
      setGreeting(greet);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-center mb-6 lg:mb-10" aria-live="polite" aria-atomic="true">
      <p className="text-muted-foreground font-medium mb-2 tracking-wide uppercase text-xs lg:text-sm">
        {greeting}
      </p>
      <div
        className="font-heading text-[clamp(3.5rem,15vw,6rem)] font-extrabold text-foreground leading-none tracking-tight tabular-nums"
        role="timer"
        aria-label={`Hora actual: ${timeString}`}
      >
        {timeString}
      </div>
      <p className="text-muted-foreground mt-3 capitalize font-medium">
        {dateString}
      </p>
    </div>
  );
}

// ============================================================================
// Memoized Components - No re-renders unless props change
// ============================================================================

const StatusBadge = memo(function StatusBadge({ estado }: { estado: ShiftInfo['estado'] }) {
  const config = {
    fuera_turno: {
      label: 'Fuera de turno',
      className: 'bg-amber-500/10 text-amber-500',
      icon: AlertCircle,
    },
    en_turno: { 
      label: 'En turno', 
      className: 'bg-success/10 text-success', 
      icon: Check 
    },
    en_pausa: { 
      label: 'En pausa', 
      className: 'bg-blue-500/10 text-blue-500', 
      icon: Coffee 
    },
    fuera_horario: {
      label: 'Fuera de horario',
      className: 'bg-destructive/10 text-destructive',
      icon: AlertCircle,
    },
  };
  const { label, className, icon: Icon } = config[estado];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
        className
      )}
    >
      <Icon size={14} />
      <span className="text-sm font-semibold tracking-tight">
        {label}
      </span>
    </div>
  );
});

const ShiftCard = memo(function ShiftCard({
  empleado,
  shift,
}: {
  empleado: {
    nombre: string;
    apellido: string;
    cargo: string | null;
    horarioEntrada: string;
    horarioSalida: string;
  };
  shift: ShiftInfo;
}) {
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return (
      String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 shadow-xl border-white/5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
            {empleado.nombre[0]}
            {empleado.apellido[0]}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-xl font-bold text-foreground">
              {empleado.nombre} {empleado.apellido}
            </h3>
            {empleado.cargo && (
              <p className="text-muted-foreground text-sm font-medium">
                {empleado.cargo}
              </p>
            )}
          </div>
        </div>
        <StatusBadge estado={shift.estado} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <LogIn size={14} className="text-success" />
            Entrada
          </div>
          <p className={cn(
            "font-heading text-2xl font-black tabular-nums",
            shift.entrada ? "text-success" : "text-muted-foreground/30"
          )}>
            {formatTime(shift.entrada)}
          </p>
          <p className="text-muted-foreground text-xs font-medium mt-1">
            Horario: {empleado.horarioEntrada}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <LogOut size={14} className="text-destructive" />
            Salida
          </div>
          <p className={cn(
            "font-heading text-2xl font-black tabular-nums",
            shift.salida ? "text-destructive" : "text-muted-foreground/30"
          )}>
            {formatTime(shift.salida)}
          </p>
          <p className="text-muted-foreground text-xs font-medium mt-1">
            Horario: {empleado.horarioSalida}
          </p>
        </div>
        {shift.pausaInicio && (
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <Coffee size={14} />
              Pausa Activa
            </div>
            <div className="flex items-center gap-6">
              <span className="font-heading text-2xl font-black text-blue-400 tabular-nums">
                {formatTime(shift.pausaInicio)}
              </span>
              {shift.pausaFin ? (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-heading text-2xl font-black text-muted-foreground/50 tabular-nums">
                    {formatTime(shift.pausaFin)}
                  </span>
                </div>
              ) : (
                <span className="text-amber-500 text-xs font-bold animate-pulse">
                  EN CURSO...
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const FichajeButton = memo(function FichajeButton({
  tipo,
  onClick,
  disabled,
  loading,
  completed,
}: {
  tipo: FichajeTipo;
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
  completed?: boolean;
}) {
  const configs = {
    entrada: {
      label: 'Entrada',
      icon: LogIn,
      className: completed ? 'bg-success/10 text-success border-success/20' : 'bg-success text-white border-success shadow-lg shadow-success/20 hover:scale-[1.02] active:scale-[0.98]',
    },
    salida: {
      label: 'Salida',
      icon: LogOut,
      className: completed ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-destructive text-white border-destructive shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98]',
    },
    pausa_inicio: {
      label: 'Pausa',
      icon: Coffee,
      className: completed ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]',
    },
    pausa_fin: {
      label: 'Fin Pausa',
      icon: Play,
      className: completed ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]',
    },
  };
  const config = configs[tipo];
  const Icon = config.icon;
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 min-w-[120px] sm:min-w-[140px] aspect-square sm:aspect-auto",
        config.className,
        (disabled || loading) && "opacity-20 cursor-not-allowed grayscale"
      )}
    >
      {loading ? (
        <Clock size={32} className="animate-spin" />
      ) : (
        <Icon size={32} />
      )}
      <span className="font-heading text-sm sm:text-base font-bold mt-2">
        {config.label}
      </span>
      {completed && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-success text-white border-2 border-background shadow-lg">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
    </button>
  );
});const HistoryItem = memo(function HistoryItem({ fichaje }: { fichaje: FichajeDisplay }) {
  const configs = {
    entrada: { color: 'text-success', bg: 'bg-success/10', icon: LogIn, label: 'Entrada' },
    salida: { color: 'text-destructive', bg: 'bg-destructive/10', icon: LogOut, label: 'Salida' },
    pausa_inicio: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Coffee, label: 'Pausa' },
    pausa_fin: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Coffee, label: 'Fin Pausa' },
  };
  const config = configs[fichaje.tipo];
  const Icon = config.icon;
  const formatTime = (date: Date) =>
    String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.bg)}>
        <Icon size={18} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-sm font-bold text-foreground">
          {config.label}
        </p>
        <p className="text-xs text-muted-foreground font-medium">
          {formatTime(fichaje.fechaHora)}
        </p>
      </div>
      {fichaje.notas && (
        <div className="px-2 py-1 rounded bg-primary/10 text-primary">
          <Edit3 size={12} />
        </div>
      )}
    </div>
  );
});

const DniKeypad = memo(function DniKeypad({
  value,
  onDigit,
  onBackspace,
  onClear,
  onSubmit,
}: {
  value: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl border-white/5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-primary/10 text-primary shadow-inner">
          <User size={28} />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Ingresá tu DNI
        </h2>
      </div>
      <div className="relative rounded-2xl p-6 mb-6 bg-black/40 border border-white/5 shadow-inner">
        <div className="flex items-center justify-center min-h-[60px]">
          <span className={cn(
            "text-4xl font-black tracking-[0.25em] font-heading tabular-nums",
            value ? "text-primary" : "text-white/10"
          )}>
            {value || '--------'}
          </span>
        </div>
        {value && (
          <button
            onClick={onBackspace}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => onDigit(num)}
            disabled={value.length >= 12}
            className="aspect-square rounded-2xl font-heading font-black text-2xl bg-white/[0.03] border border-white/5 text-foreground hover:bg-white/[0.08] active:scale-95 transition-all disabled:opacity-20"
          >
            {num}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={onClear}
          className="aspect-square rounded-2xl font-bold text-sm bg-white/[0.03] border border-white/5 text-muted-foreground hover:bg-white/[0.08] active:scale-95 transition-all"
        >
          AC
        </button>
        <button
          onClick={() => onDigit('0')}
          disabled={value.length >= 12}
          className="aspect-square rounded-2xl font-heading font-black text-2xl bg-white/[0.03] border border-white/5 text-foreground hover:bg-white/[0.08] active:scale-95 transition-all disabled:opacity-20"
        >
          0
        </button>
        <button
          onClick={onBackspace}
          disabled={!value}
          className="aspect-square rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/20 active:scale-95 transition-all disabled:opacity-20"
        >
          <Trash2 size={24} />
        </button>
      </div>
      <button
        onClick={onSubmit}
        disabled={value.length < 6}
        className="w-full py-4 rounded-2xl font-heading font-bold text-lg bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:shadow-none"
      >
        Confirmar Identidad
      </button>
    </div>
  );
});

const StatsCard = memo(function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClassName,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  colorClassName: string;
}) {
  return (
    <div className="glass-card p-4 rounded-xl border-white/5 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorClassName.replace('text-', 'bg-').concat('/10'))}>
          <Icon size={16} className={colorClassName} />
        </div>
      </div>
      <p className="font-heading text-2xl font-black text-foreground">
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-tighter">
          {subtitle}
        </p>
      )}
    </div>
  );
});

const WeeklyChart = memo(function WeeklyChart({
  data,
}: {
  data: { dia: string; horas: number }[];
}) {
  return (
    <div className="glass-card p-5 rounded-2xl border-white/5 shadow-xl">
      <h3 className="font-heading text-lg font-bold text-foreground mb-6">
        Horas trabajadas
      </h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="dia"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v + 'h'}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{
                background: 'rgba(20, 20, 22, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                padding: '10px 14px'
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, marginBottom: '4px', fontSize: '12px' }}
              itemStyle={{ color: '#7C6FCD', fontWeight: 700, fontSize: '12px' }}
              formatter={(value) => [
                typeof value === 'number' ? value.toFixed(1) : value + ' horas',
                'Horas',
              ]}
            />
            <Bar dataKey="horas" fill="#7C6FCD" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const NotesModal = memo(function NotesModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notas: string) => void;
  loading: boolean;
}) {
  const [notas, setNotas] = useState('');
  const handleSubmit = () => {
    onSubmit(notas);
    setNotas('');
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="w-full max-w-md glass-card rounded-2xl p-6 border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Agregar nota
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Reunion con clientes..."
              className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none min-h-[140px]"
              autoFocus
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-foreground font-bold hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

// ============================================================================
// Main Component - NO time-based state, only uses time for calculations when needed
// ============================================================================

export default function EmpleadosFichajePage() {
  const [dni, setDni] = useState('');
  const [showEmployeeCard, setShowEmployeeCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingFichaje, setPendingFichaje] = useState<{
    tipo: FichajeTipo;
    notas?: string;
  } | null>(null);
  const [showStats, setShowStats] = useState(false);
  // Time ref for shift calculations - does NOT trigger re-renders
  const timeRef = useRef(new Date());

  // Update time ref every second for shift calculations
  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current = new Date();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: empleado, refetch: refetchEmpleado } = useEmpleadoByDni(dni);
  const { data: todosFichajes } = useEmpleadoFichajes({ hoy: true });
  const createFichaje = useCreateFichaje();

  // Memoized shift calculation - uses ref, not state
  const shiftInfo = useMemo<ShiftInfo>(() => {
    if (!empleado)
      return {
        entrada: null,
        pausaInicio: null,
        pausaFin: null,
        salida: null,
        estado: 'fuera_turno',
      };
    const fichajes = empleado.fichajes || [];
    const now = new Date();
    const hoyFichajes = fichajes.filter((f) => {
      const fd = new Date(f.fechaHora);
      return (
        fd.getDate() === now.getDate() &&
        fd.getMonth() === now.getMonth() &&
        fd.getFullYear() === now.getFullYear()
      );
    });
    const entrada = hoyFichajes.find((f) => f.tipo === 'entrada');
    const pausaInicio = hoyFichajes.find((f) => f.tipo === 'pausa_inicio');
    const pausaFin = hoyFichajes.find((f) => f.tipo === 'pausa_fin');
    const salida = hoyFichajes.find((f) => f.tipo === 'salida');
    let estado: ShiftInfo['estado'] = 'fuera_turno';
    if (entrada) {
      if (pausaInicio && !pausaFin) estado = 'en_pausa';
      else if (!salida) estado = 'en_turno';
      else estado = 'fuera_turno';
    }
    return {
      entrada: entrada ? new Date(entrada.fechaHora) : null,
      pausaInicio: pausaInicio ? new Date(pausaInicio.fechaHora) : null,
      pausaFin: pausaFin ? new Date(pausaFin.fechaHora) : null,
      salida: salida ? new Date(salida.fechaHora) : null,
      estado,
    };
  }, [empleado]);

  const hoyFichajes = useMemo<FichajeDisplay[]>(() => {
    if (!empleado?.fichajes) return [];
    const now = new Date();
    return empleado.fichajes
      .filter((f) => {
        const fd = new Date(f.fechaHora);
        return (
          fd.getDate() === now.getDate() &&
          fd.getMonth() === now.getMonth() &&
          fd.getFullYear() === now.getFullYear()
        );
      })
      .map((f) => ({
        id: f.id,
        fechaHora: new Date(f.fechaHora),
        tipo: f.tipo as FichajeTipo,
        notas: f.notas,
      }))
      .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
  }, [empleado]);

  const weeklyStats = useMemo(() => {
    if (!todosFichajes || !empleado)
      return { totalHoras: 0, promedioDiario: 0, diasTrabajados: 0, chartData: [] };
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
    const fichajesSemana = todosFichajes.filter(
      (f) => new Date(f.fechaHora) >= unaSemanaAtras && f.empleadoId === empleado.id,
    );
    const horasPorDia: Record<string, number> = {};
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - (6 - i));
      horasPorDia[diasSemana[fecha.getDay()]] = 0;
    }
    fichajesSemana.forEach((f) => {
      if (f.tipo === 'entrada') {
        const fd = new Date(f.fechaHora);
        horasPorDia[diasSemana[fd.getDay()]] += 0.5;
      }
    });
    const totalHoras = Object.values(horasPorDia).reduce((a, b) => a + b, 0);
    const diasTrabajados = Object.values(horasPorDia).filter((h) => h > 0).length;
    const chartData = Object.entries(horasPorDia).map(([dia, horas]) => ({
      dia,
      horas: Math.round(horas * 10) / 10,
    }));
    return {
      totalHoras: Math.round(totalHoras * 10) / 10,
      promedioDiario: diasTrabajados > 0 ? Math.round((totalHoras / diasTrabajados) * 10) / 10 : 0,
      diasTrabajados,
      chartData,
    };
  }, [todosFichajes, empleado]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (dni.length < 12) setDni((prev) => prev + digit);
    },
    [dni],
  );
  const handleBackspace = useCallback(() => {
    setDni((prev) => prev.slice(0, -1));
  }, []);
  const handleClear = useCallback(() => {
    setDni('');
    setShowEmployeeCard(false);
    setNotFound(false);
  }, []);
  const handleSubmit = useCallback(async () => {
    if (dni.length < 6) return;
    setNotFound(false);
    setShowEmployeeCard(false);
    try {
      const result = await refetchEmpleado();
      if (result.data) {
        setShowEmployeeCard(true);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [dni, refetchEmpleado]);
  const handleFichaje = useCallback(
    async (tipo: FichajeTipo, notas?: string) => {
      if (!empleado) return;
      try {
        await createFichaje.mutateAsync({ empleadoId: empleado.id, tipo, notas });
        await refetchEmpleado();
      } catch (e) {
        console.error(e);
      }
    },
    [empleado, createFichaje, refetchEmpleado],
  );
  const handleFichajeWithNotes = useCallback((tipo: FichajeTipo) => {
    setPendingFichaje({ tipo });
    setShowNotesModal(true);
  }, []);
  const handleNotesSubmit = useCallback(
    async (notas: string) => {
      if (!pendingFichaje) return;
      await handleFichaje(pendingFichaje.tipo, notas);
      setShowNotesModal(false);
      setPendingFichaje(null);
    },
    [pendingFichaje, handleFichaje],
  );

  const canCheckIn = !shiftInfo.entrada;
  const canCheckOut = shiftInfo.entrada && !shiftInfo.salida && !shiftInfo.pausaInicio;
  const canStartPause = shiftInfo.entrada && !shiftInfo.pausaInicio && !shiftInfo.salida;
  const canEndPause = shiftInfo.pausaInicio && !shiftInfo.pausaFin;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0D0D0F] text-foreground font-sans selection:bg-primary/30">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 flex flex-col gap-6 lg:gap-10 overflow-y-auto">
        <ClockDisplay />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Input and Main Actions */}
          <div className="space-y-8">
            {!showEmployeeCard && !notFound && (
              <DniKeypad
                value={dni}
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onClear={handleClear}
                onSubmit={handleSubmit}
              />
            )}
            {notFound && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-10 border-destructive/20 text-center shadow-2xl"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertCircle size={48} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-destructive mb-3">
                  Empleado no encontrado
                </h3>
                <p className="text-muted-foreground mb-8">
                  El DNI ingresado no corresponde a ningun empleado activo.
                </p>
                <button
                  onClick={handleClear}
                  className="px-8 py-4 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                >
                  Intentar de nuevo
                </button>
              </motion.div>
            )}
            {showEmployeeCard && empleado && (
              <div className="space-y-6">
                <ShiftCard empleado={empleado} shift={shiftInfo} />
                
                <div className="glass-card rounded-3xl p-6 sm:p-8 border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <h3 className="font-heading text-lg font-bold text-center text-muted-foreground uppercase tracking-widest mb-8">
                    Acciones de Fichaje
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <FichajeButton
                      tipo="entrada"
                      onClick={() => handleFichajeWithNotes('entrada')}
                      disabled={!canCheckIn}
                      completed={!!shiftInfo.entrada}
                    />
                    <FichajeButton
                      tipo="pausa_inicio"
                      onClick={() => handleFichajeWithNotes('pausa_inicio')}
                      disabled={!canStartPause}
                      completed={!!shiftInfo.pausaInicio}
                    />
                    <FichajeButton
                      tipo="pausa_fin"
                      onClick={() => handleFichajeWithNotes('pausa_fin')}
                      disabled={!canEndPause}
                      completed={!!shiftInfo.pausaFin}
                    />
                    <FichajeButton
                      tipo="salida"
                      onClick={() => handleFichajeWithNotes('salida')}
                      disabled={!canCheckOut}
                      completed={!!shiftInfo.salida}
                    />
                  </div>
                </div>

                <button
                  onClick={handleClear}
                  className="w-full py-4 rounded-2xl border border-white/10 text-muted-foreground font-bold hover:bg-white/5 hover:text-foreground transition-all flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  Cambiar empleado
                </button>
              </div>
            )}
          </div>

          {/* Right Column: History and Stats */}
          <div className="space-y-6">
            {showEmployeeCard && (
              <div className="glass-card rounded-3xl p-6 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Historial de hoy
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/40">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                {hoyFichajes.length > 0 ? (
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                    {hoyFichajes.map((f) => (
                      <HistoryItem key={f.id} fichaje={f} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
                    <Clock size={40} className="mx-auto mb-3 text-muted-foreground/20" />
                    <p className="text-muted-foreground/40 font-medium text-sm">
                      Sin actividad registrada hoy
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowStats(!showStats)}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group",
                showStats 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "glass-card border-white/5 text-foreground hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={22} className={cn(showStats ? "text-white" : "text-primary")} />
                <span className="font-heading text-lg font-bold tracking-tight">
                  Métricas de Rendimiento
                </span>
              </div>
              {showStats ? (
                <ChevronUp size={22} />
              ) : (
                <ChevronDown size={22} className="text-muted-foreground group-hover:text-foreground" />
              )}
            </button>

            <AnimatePresence>
              {showStats && showEmployeeCard && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatsCard
                      title="Total Horas"
                      value={weeklyStats.totalHoras + 'h'}
                      subtitle="Semanal"
                      icon={Clock}
                      colorClassName="text-primary"
                    />
                    <StatsCard
                      title="Promedio"
                      value={weeklyStats.promedioDiario + 'h'}
                      subtitle="Diario"
                      icon={TrendingUp}
                      colorClassName="text-success"
                    />
                    <StatsCard
                      title="Asistencia"
                      value={weeklyStats.diasTrabajados}
                      subtitle="Dias"
                      icon={BarChart3}
                      colorClassName="text-amber-500"
                    />
                  </div>
                  <WeeklyChart data={weeklyStats.chartData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          setPendingFichaje(null);
        }}
        onSubmit={handleNotesSubmit}
        loading={createFichaje.isPending}
      />
    </div>
  );
}
