'use client';

import { useState, useCallback, useEffect, useMemo, memo } from 'react';
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
  ChevronRight,
  Users,
  Loader2,
  Play,
} from 'lucide-react';
import {
  useEmpleados,
  useEmpleadoFichajes,
  useCreateFichaje,
  useEmpleadoByDni,
} from '@/hooks/useEmpleadoFichajes';
import { cn } from '@/lib/utils';

type FichajeTipo = 'entrada' | 'salida' | 'pausa_inicio' | 'pausa_fin';

type ShiftStatus = 'fuera_turno' | 'en_turno' | 'en_pausa' | 'sin_registrar';

interface ShiftInfo {
  entrada: Date | null;
  pausaInicio: Date | null;
  pausaFin: Date | null;
  salida: Date | null;
  estado: ShiftStatus;
}

interface FichajeDisplay {
  id: string;
  fechaHora: Date;
  tipo: FichajeTipo;
  notas: string | null;
}

interface EmpleadoConShift {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string | null;
  horarioEntrada: string;
  horarioSalida: string;
  dni: string;
  shift: ShiftInfo;
}

// ============================================================================
// Clock Component
// ============================================================================

function ClockDisplay() {
  const [timeString, setTimeString] = useState('00:00:00');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    let mounted = true;
    const updateClock = () => {
      if (!mounted) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hh}:${mm}:${ss}`);
      const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setDateString(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-center mb-6">
      <p className="text-muted-foreground font-medium mb-1 text-xs uppercase tracking-wide">
        {dateString}
      </p>
      <div className="font-heading text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
        {timeString}
      </div>
    </div>
  );
}

// ============================================================================
// Status Badge
// ============================================================================

const StatusBadge = memo(function StatusBadge({ estado }: { estado: ShiftStatus }) {
  const config = {
    en_turno: { label: 'En turno', className: 'bg-success/10 text-success border-success/20' },
    en_pausa: { label: 'En pausa', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    fuera_turno: { label: 'Fuera de turno', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    sin_registrar: { label: 'Sin registrar', className: 'bg-muted text-muted-foreground border-border' },
  };
  const { label, className } = config[estado];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', className)}>
      {label}
    </span>
  );
});

// ============================================================================
// Employee Row Card
// ============================================================================

const EmployeeRow = memo(function EmployeeRow({
  emp,
  isSelected,
  onClick,
}: {
  emp: EmpleadoConShift;
  isSelected: boolean;
  onClick: () => void;
}) {
  const initials = emp.nombre[0] + emp.apellido[0];
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 text-left',
        isSelected
          ? 'bg-primary/5 border-primary/30 shadow-sm'
          : 'bg-card border-border hover:bg-muted/50 hover:border-border/80'
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">
          {emp.nombre} {emp.apellido}
        </p>
        {emp.cargo && (
          <p className="text-xs text-muted-foreground truncate">{emp.cargo}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge estado={emp.shift.estado} />
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {emp.shift.entrada
            ? `${String(emp.shift.entrada.getHours()).padStart(2,'0')}:${String(emp.shift.entrada.getMinutes()).padStart(2,'0')}`
            : '--:--'}
          {' → '}
          {emp.shift.salida
            ? `${String(emp.shift.salida.getHours()).padStart(2,'0')}:${String(emp.shift.salida.getMinutes()).padStart(2,'0')}`
            : emp.shift.entrada ? 'En curso' : '--:--'}
        </span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
    </button>
  );
});

// ============================================================================
// Detail Panel
// ============================================================================

function DetailPanel({
  emp,
  onClose,
  onFichaje,
}: {
  emp: EmpleadoConShift;
  onClose: () => void;
  onFichaje: (tipo: FichajeTipo) => void;
}) {
  const [hoyFichajes, setHoyFichajes] = useState<FichajeDisplay[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHoyFichajes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/empleados/fichajes?empleadoId=${emp.id}&hoy=true`);
      if (res.ok) {
        const data = await res.json();
        const now = new Date();
        const filtered = (data as any[])
          .filter((f) => {
            const fd = new Date(f.fechaHora);
            return fd.getDate() === now.getDate() && fd.getMonth() === now.getMonth() && fd.getFullYear() === now.getFullYear();
          })
          .map((f) => ({
            id: f.id,
            fechaHora: new Date(f.fechaHora),
            tipo: f.tipo as FichajeTipo,
            notas: f.notas,
          }))
          .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
        setHoyFichajes(filtered);
      }
    } finally {
      setLoading(false);
    }
  }, [emp.id]);

  useEffect(() => {
    fetchHoyFichajes();
  }, [fetchHoyFichajes]);

  const formatTime = (d: Date | null) => {
    if (!d) return '--:--';
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const tipoConfig = {
    entrada: { icon: LogIn, color: 'text-success', label: 'Entrada' },
    salida: { icon: LogOut, color: 'text-destructive', label: 'Salida' },
    pausa_inicio: { icon: Coffee, color: 'text-blue-500', label: 'Pausa' },
    pausa_fin: { icon: Play, color: 'text-amber-500', label: 'Fin pausa' },
  };

  const canEntrada = !emp.shift.entrada;
  const canPausaInicio = emp.shift.entrada && !emp.shift.pausaInicio && !emp.shift.salida;
  const canPausaFin = emp.shift.pausaInicio && !emp.shift.pausaFin;
  const canSalida = emp.shift.entrada && !emp.shift.salida && (!emp.shift.pausaInicio || emp.shift.pausaFin);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-lg font-bold text-white">
            {emp.nombre[0]}{emp.apellido[0]}
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              {emp.nombre} {emp.apellido}
            </h2>
            <p className="text-sm text-muted-foreground">{emp.dni}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Status */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <StatusBadge estado={emp.shift.estado} />
          <span className="text-sm text-muted-foreground">
            Horario: {emp.horarioEntrada} — {emp.horarioSalida}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-5 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Acciones rápidas
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onFichaje('entrada')}
            disabled={!canEntrada}
            className={cn(
              'flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all',
              canEntrada
                ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
            )}
          >
            <LogIn size={16} /> Entrada
          </button>
          <button
            onClick={() => onFichaje('salida')}
            disabled={!canSalida}
            className={cn(
              'flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all',
              canSalida
                ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
            )}
          >
            <LogOut size={16} /> Salida
          </button>
          <button
            onClick={() => onFichaje('pausa_inicio')}
            disabled={!canPausaInicio}
            className={cn(
              'flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all',
              canPausaInicio
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20'
                : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
            )}
          >
            <Coffee size={16} /> Pausa
          </button>
          <button
            onClick={() => onFichaje('pausa_fin')}
            disabled={!canPausaFin}
            className={cn(
              'flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all',
              canPausaFin
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
            )}
          >
            <Play size={16} /> Fin pausa
          </button>
        </div>
      </div>

      {/* Today's History */}
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Historial de hoy
        </p>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : hoyFichajes.length === 0 ? (
          <p className="text-sm text-muted-foreground/60 text-center py-6">
            Sin actividad registrada hoy
          </p>
        ) : (
          <div className="space-y-2 max-h-[240px] overflow-y-auto">
            {hoyFichajes.map((f) => {
              const cfg = tipoConfig[f.tipo];
              const Icon = cfg.icon;
              return (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-muted')}>
                    <Icon size={14} className={cfg.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{cfg.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatTime(f.fechaHora)}
                    </p>
                  </div>
                  {f.notas && (
                    <span className="text-xs text-muted-foreground/60 italic truncate max-w-[100px]">
                      {f.notas}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function EmpleadosPage() {
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoConShift | null>(null);
  const [filter, setFilter] = useState<'todos' | ShiftStatus>('todos');

  const { data: empleados, isLoading } = useEmpleados();
  const { data: fichajes, isLoading: loadingFichajes } = useEmpleadoFichajes({ hoy: true });
  const createFichaje = useCreateFichaje();
  const { refetch: refetchEmpleado } = useEmpleadoByDni('');

  // Build employee list with shift info
  const empleadosConShift = useMemo<EmpleadoConShift[]>(() => {
    if (!empleados) return [];
    const now = new Date();

    return empleados.map((emp) => {
      const empFichajes = (fichajes || [])
        .filter((f) => f.empleadoId === emp.id)
        .map((f) => ({
          ...f,
          fechaHora: new Date(f.fechaHora),
        }));

      const hoyFichajes = empFichajes.filter((f) => {
        const fd = f.fechaHora;
        return fd.getDate() === now.getDate() && fd.getMonth() === now.getMonth() && fd.getFullYear() === now.getFullYear();
      });

      const entrada = hoyFichajes.find((f) => f.tipo === 'entrada');
      const pausaInicio = hoyFichajes.find((f) => f.tipo === 'pausa_inicio');
      const pausaFin = hoyFichajes.find((f) => f.tipo === 'pausa_fin');
      const salida = hoyFichajes.find((f) => f.tipo === 'salida');

      let estado: ShiftStatus = 'sin_registrar';
      if (entrada) {
        if (pausaInicio && !pausaFin) estado = 'en_pausa';
        else if (!salida) estado = 'en_turno';
        else estado = 'fuera_turno';
      } else {
        estado = 'sin_registrar';
      }

      return {
        id: emp.id,
        nombre: emp.nombre,
        apellido: emp.apellido,
        cargo: emp.cargo,
        horarioEntrada: emp.horarioEntrada,
        horarioSalida: emp.horarioSalida,
        dni: emp.dni,
        shift: {
          entrada: entrada ? entrada.fechaHora : null,
          pausaInicio: pausaInicio ? pausaInicio.fechaHora : null,
          pausaFin: pausaFin ? pausaFin.fechaHora : null,
          salida: salida ? salida.fechaHora : null,
          estado,
        },
      };
    });
  }, [empleados, fichajes]);

  // Filter employees
  const filteredEmpleados = useMemo(() => {
    if (filter === 'todos') return empleadosConShift;
    return empleadosConShift.filter((e) => e.shift.estado === filter);
  }, [empleadosConShift, filter]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: empleadosConShift.length };
    empleadosConShift.forEach((e) => {
      c[e.shift.estado] = (c[e.shift.estado] || 0) + 1;
    });
    return c;
  }, [empleadosConShift]);

  const handleFichaje = useCallback(
    async (tipo: FichajeTipo) => {
      if (!selectedEmpleado) return;
      try {
        await createFichaje.mutateAsync({ empleadoId: selectedEmpleado.id, tipo });
        // Refresh selected empleado
        const updated = empleadosConShift.find((e) => e.id === selectedEmpleado.id);
        if (updated) setSelectedEmpleado(updated);
      } catch (e) {
        console.error(e);
      }
    },
    [selectedEmpleado, createFichaje, empleadosConShift]
  );

  const handleCloseDetail = () => setSelectedEmpleado(null);

  const isLoadingAll = isLoading || loadingFichajes;

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-6 py-5 shrink-0 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Control de Empleados</h1>
              <p className="text-xs text-muted-foreground">
                {counts.en_turno || 0} en turno · {counts.en_pausa || 0} en pausa · {counts.sin_registrar || 0} sin registrar
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto">
          {(['todos', 'en_turno', 'en_pausa', 'fuera_turno', 'sin_registrar'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {f === 'todos' ? 'Todos' : f === 'en_turno' ? 'En turno' : f === 'en_pausa' ? 'En pausa' : f === 'fuera_turno' ? 'Fuera de turno' : 'Sin registrar'}
              {' '}
              <span className={cn('ml-1 px-1.5 py-0.5 rounded text-[10px]', filter === f ? 'bg-white/20' : 'bg-muted-foreground/10')}>
                {counts[f] || 0}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoadingAll ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 size={28} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando empleados...</p>
          </div>
        ) : filteredEmpleados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Users size={40} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">No hay empleados para mostrar</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Employee List */}
            <div className={cn('flex-1', selectedEmpleado && 'lg:max-w-md')}>
              <div className="space-y-2">
                {filteredEmpleados.map((emp) => (
                  <EmployeeRow
                    key={emp.id}
                    emp={emp}
                    isSelected={selectedEmpleado?.id === emp.id}
                    onClick={() =>
                      setSelectedEmpleado(selectedEmpleado?.id === emp.id ? null : emp)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
              {selectedEmpleado && (
                <div className="lg:w-[400px] shrink-0">
                  <DetailPanel
                    emp={selectedEmpleado}
                    onClose={handleCloseDetail}
                    onFichaje={handleFichaje}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
