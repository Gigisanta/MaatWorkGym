"use client";

import { useState, useCallback, useEffect, useMemo, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogIn, LogOut, Coffee, User, Check, AlertCircle, X, ChevronDown, ChevronUp, Calendar, TrendingUp, BarChart3, Edit3, Trash2, Play } from "lucide-react";
import { useEmpleadoByDni, useEmpleadoFichajes, useCreateFichaje } from "@/hooks/useEmpleadoFichajes";
import { colors, fontFamily, fontSize, fontWeight, spacing, borderRadius } from "@/lib/design-system";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type FichajeTipo = "entrada" | "salida" | "pausa_inicio" | "pausa_fin";

interface FichajeDisplay { id: string; fechaHora: Date; tipo: FichajeTipo; notas: string | null; }
interface ShiftInfo { entrada: Date | null; pausaInicio: Date | null; pausaFin: Date | null; salida: Date | null; estado: "fuera_turno" | "en_turno" | "en_pausa" | "fuera_horario"; }

// ============================================================================
// Clock Component - Completely isolated with its own timer
// ============================================================================

function ClockDisplay() {
  const [timeString, setTimeString] = useState("00:00:00");
  const [dateString, setDateString] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    let mounted = true;
    
    const updateClock = () => {
      if (!mounted) return;
      const now = new Date();
      const hours = now.getHours();
      
      let greet = "Buenas noches";
      if (hours >= 6 && hours < 12) greet = "Buenos dias";
      else if (hours >= 12 && hours < 18) greet = "Buenas tardes";
      
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      
      const dateStr = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      
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
    <div className="text-center mb-8" aria-live="polite" aria-atomic="true">
      <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.lg, color: colors.textSecondary, marginBottom: spacing[1] }}>
        {greeting}
      </p>
      <div 
        style={{ 
          fontFamily: fontFamily.syne, 
          fontSize: "clamp(48px, 12vw, 80px)", 
          fontWeight: fontWeight.bold, 
          color: colors.textPrimary, 
          lineHeight: 1, 
          letterSpacing: "0.05em",
          fontVariantNumeric: "tabular-nums",
          minWidth: "280px"
        }}
        role="timer"
        aria-label={`Hora actual: ${timeString}`}
      >
        {timeString}
      </div>
      <p style={{ 
        fontFamily: fontFamily.dmSans, 
        fontSize: fontSize.base, 
        color: colors.textSecondary, 
        marginTop: spacing[2], 
        textTransform: "capitalize",
        minHeight: "1.5em"
      }}>
        {dateString}
      </p>
    </div>
  );
}

// ============================================================================
// Memoized Components - No re-renders unless props change
// ============================================================================

const StatusBadge = memo(function StatusBadge({ estado }: { estado: ShiftInfo["estado"] }) {
  const config = {
    fuera_turno: { label: "Fuera de turno", bg: colors.amberBg, color: colors.amber, icon: AlertCircle },
    en_turno: { label: "En turno", bg: colors.successBg, color: colors.success, icon: Check },
    en_pausa: { label: "En pausa", bg: colors.blueBg, color: colors.blue, icon: Coffee },
    fuera_horario: { label: "Fuera de horario", bg: colors.dangerBg, color: colors.danger, icon: AlertCircle },
  };
  const { label, bg, color, icon: Icon } = config[estado];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: spacing[2], padding: spacing[2] + "px " + spacing[4] + "px", borderRadius: borderRadius.full, background: bg, color }}>
      <Icon size={16} /><span style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>{label}</span>
    </div>
  );
});

const ShiftCard = memo(function ShiftCard({ empleado, shift }: { empleado: { nombre: string; apellido: string; cargo: string | null; horarioEntrada: string; horarioSalida: string }; shift: ShiftInfo }) {
  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
  };

  return (
    <div className="rounded-2xl p-5 border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ background: "linear-gradient(135deg, " + colors.accent + ", #6D28D9)" }}>
            {empleado.nombre[0]}{empleado.apellido[0]}
          </div>
          <div>
            <h3 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary }}>{empleado.nombre} {empleado.apellido}</h3>
            {empleado.cargo && <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm, color: colors.textSecondary }}>{empleado.cargo}</p>}
          </div>
        </div>
        <StatusBadge estado={shift.estado} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl" style={{ background: colors.bgElevated }}>
          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: colors.textSecondary }}><LogIn size={12} style={{ color: colors.success }} />Entrada</div>
          <p style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: shift.entrada ? colors.success : colors.textSecondary }}>{formatTime(shift.entrada)}</p>
          <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.xs, color: colors.textSecondary }}>Horario: {empleado.horarioEntrada}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: colors.bgElevated }}>
          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: colors.textSecondary }}><LogOut size={12} style={{ color: colors.danger }} />Salida</div>
          <p style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: shift.salida ? colors.danger : colors.textSecondary }}>{formatTime(shift.salida)}</p>
          <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.xs, color: colors.textSecondary }}>Horario: {empleado.horarioSalida}</p>
        </div>
        {shift.pausaInicio && (
          <div className="p-3 rounded-xl col-span-2" style={{ background: colors.blueBg }}>
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: colors.blue }}><Coffee size={12} />Pausa</div>
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: fontFamily.syne, color: colors.blue }}>{formatTime(shift.pausaInicio)}</span>
              {shift.pausaFin ? <span style={{ color: colors.textSecondary }}>| {formatTime(shift.pausaFin)}</span> : <span style={{ color: colors.amber, fontSize: fontSize.xs }}>En curso...</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const FichajeButton = memo(function FichajeButton({ tipo, onClick, disabled, loading, completed }: { tipo: FichajeTipo; onClick: () => void; disabled: boolean; loading?: boolean; completed?: boolean }) {
  const configs = {
    entrada: { label: "Entrada", icon: LogIn, bg: completed ? colors.successBg : colors.success, color: completed ? colors.success : "#fff", borderColor: colors.success },
    salida: { label: "Salida", icon: LogOut, bg: completed ? colors.dangerBg : colors.danger, color: completed ? colors.danger : "#fff", borderColor: colors.danger },
    pausa_inicio: { label: "Pausa", icon: Coffee, bg: completed ? colors.blueBg : colors.blue, color: completed ? colors.blue : "#fff", borderColor: colors.blue },
    pausa_fin: { label: "Fin Pausa", icon: Play, bg: completed ? colors.amberBg : colors.amber, color: completed ? colors.amber : "#fff", borderColor: colors.amber },
  };
  const config = configs[tipo];
  const Icon = config.icon;
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className="relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
      style={{ background: config.bg, borderColor: config.borderColor, minWidth: "140px", minHeight: "100px", boxShadow: disabled ? "none" : "0 8px 32px " + config.borderColor + "30" }}
    >
      {loading ? <Clock size={32} style={{ color: config.color }} /> : <Icon size={32} style={{ color: config.color }} />}
      <span style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: config.color, marginTop: spacing[2] }}>{config.label}</span>
      {completed && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: colors.success }}>
          <Check size={14} color="#fff" />
        </div>
      )}
    </button>
  );
});

const HistoryItem = memo(function HistoryItem({ fichaje }: { fichaje: FichajeDisplay }) {
  const getIcon = (tipo: FichajeTipo) => tipo === "entrada" ? LogIn : tipo === "salida" ? LogOut : Coffee;
  const getLabel = (tipo: FichajeTipo) => tipo === "entrada" ? "Entrada" : tipo === "salida" ? "Salida" : tipo === "pausa_inicio" ? "Pausa" : "Fin Pausa";
  const Icon = getIcon(fichaje.tipo);
  const colorMap: Record<FichajeTipo, string> = { entrada: colors.success, salida: colors.danger, pausa_inicio: colors.blue, pausa_fin: colors.amber };
  const bgMap: Record<FichajeTipo, string> = { entrada: colors.successBg, salida: colors.dangerBg, pausa_inicio: colors.blueBg, pausa_fin: colors.amberBg };
  const formatTime = (date: Date) => String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: colors.bgElevated }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bgMap[fichaje.tipo] }}><Icon size={18} style={{ color: colorMap[fichaje.tipo] }} /></div>
      <div className="flex-1"><p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textPrimary }}>{getLabel(fichaje.tipo)}</p><p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.xs, color: colors.textSecondary }}>{formatTime(fichaje.fechaHora)}</p></div>
      {fichaje.notas && <div className="px-2 py-1 rounded text-xs" style={{ background: colors.accentBg, color: colors.accent }}><Edit3 size={12} /></div>}
    </div>
  );
});

const DniKeypad = memo(function DniKeypad({ value, onDigit, onBackspace, onClear, onSubmit }: { value: string; onDigit: (digit: string) => void; onBackspace: () => void; onClear: () => void; onSubmit: () => void }) {
  return (
    <div className="rounded-2xl p-5 border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
      <div className="text-center mb-4">
        <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ background: colors.accentBg }}><User size={24} style={{ color: colors.accent }} /></div>
        <h2 style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary }}>Ingresa tu DNI</h2>
      </div>
      <div className="relative rounded-xl p-4 mb-4 border" style={{ background: colors.bgElevated, borderColor: colors.border }}>
        <div className="flex items-center justify-center min-h-[56px]">
          <span className="text-3xl font-bold tracking-[0.2em]" style={{ fontFamily: fontFamily.syne, color: value ? colors.textPrimary : colors.textSecondary, fontVariantNumeric: "tabular-nums" }}>{value || "--------"}</span>
        </div>
        {value && <button onClick={onBackspace} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg" style={{ color: colors.textSecondary }}><X size={16} /></button>}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (<button key={num} onClick={() => onDigit(num)} disabled={value.length >= 12} className="aspect-square rounded-xl font-bold text-xl border" style={{ background: colors.bgElevated, borderColor: colors.border, color: colors.textPrimary, fontFamily: fontFamily.syne }}>{num}</button>))}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div />
        <button onClick={() => onDigit("0")} disabled={value.length >= 12} className="aspect-square rounded-xl font-bold text-xl border" style={{ background: colors.bgElevated, borderColor: colors.border, color: colors.textPrimary, fontFamily: fontFamily.syne }}>0</button>
        <button onClick={onBackspace} disabled={!value} className="aspect-square rounded-xl border flex items-center justify-center disabled:opacity-30" style={{ background: colors.bgElevated, borderColor: colors.border, color: colors.danger }}><Trash2 size={20} /></button>
      </div>
      <button onClick={onSubmit} disabled={value.length < 6} className="w-full py-3 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: colors.accent, color: "#fff", fontFamily: fontFamily.dmSans }}>Confirmar</button>
      <button onClick={onClear} className="w-full mt-2 py-2 text-sm text-center" style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}>Limpiar todo</button>
    </div>
  );
});

const StatsCard = memo(function StatsCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm, color: colors.textSecondary }}>{title}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "20" }}><Icon size={16} style={{ color }} /></div>
      </div>
      <p style={{ fontFamily: fontFamily.syne, fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, color: colors.textPrimary }}>{value}</p>
      {subtitle && <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing[1] }}>{subtitle}</p>}
    </div>
  );
});

const WeeklyChart = memo(function WeeklyChart({ data }: { data: { dia: string; horas: number }[] }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
      <h3 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing[4] }}>Horas trabajadas</h3>
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: colors.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: colors.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => v + "h"} />
            <Tooltip contentStyle={{ background: colors.bgElevated, border: "1px solid " + colors.border, borderRadius: borderRadius.lg, fontFamily: fontFamily.dmSans }} labelStyle={{ color: colors.textPrimary }} itemStyle={{ color: colors.accent }} formatter={(value) => [typeof value === 'number' ? value.toFixed(1) : value + " horas", "Trabajadas"]} />
            <Bar dataKey="horas" fill={colors.accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const NotesModal = memo(function NotesModal({ isOpen, onClose, onSubmit, loading }: { isOpen: boolean; onClose: () => void; onSubmit: (notas: string) => void; loading: boolean }) {
  const [notas, setNotas] = useState("");
  const handleSubmit = () => { onSubmit(notas); setNotas(""); };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
          <div className="w-full max-w-md rounded-2xl p-6 border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary }}>Agregar nota</h2>
              <button onClick={onClose} className="p-2 rounded-lg" style={{ color: colors.textSecondary }}><X size={20} /></button>
            </div>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej: Reunion con clientes..." className="w-full p-4 rounded-xl border resize-none" style={{ background: colors.bgElevated, borderColor: colors.border, color: colors.textPrimary, fontFamily: fontFamily.dmSans, minHeight: "120px" }} autoFocus />
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border font-medium" style={{ borderColor: colors.border, color: colors.textPrimary, fontFamily: fontFamily.dmSans }}>Cancelar</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl font-medium disabled:opacity-50" style={{ background: colors.accent, color: "#fff", fontFamily: fontFamily.dmSans }}>{loading ? "Guardando..." : "Guardar"}</button>
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
  const [dni, setDni] = useState("");
  const [showEmployeeCard, setShowEmployeeCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingFichaje, setPendingFichaje] = useState<{ tipo: FichajeTipo; notas?: string } | null>(null);
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
    if (!empleado) return { entrada: null, pausaInicio: null, pausaFin: null, salida: null, estado: "fuera_turno" };
    const fichajes = empleado.fichajes || [];
    const today = timeRef.current;
    const hoyFichajes = fichajes.filter((f) => {
      const fd = new Date(f.fechaHora);
      return fd.getDate() === today.getDate() && fd.getMonth() === today.getMonth() && fd.getFullYear() === today.getFullYear();
    });
    const entrada = hoyFichajes.find((f) => f.tipo === "entrada");
    const pausaInicio = hoyFichajes.find((f) => f.tipo === "pausa_inicio");
    const pausaFin = hoyFichajes.find((f) => f.tipo === "pausa_fin");
    const salida = hoyFichajes.find((f) => f.tipo === "salida");
    let estado: ShiftInfo["estado"] = "fuera_turno";
    if (entrada) {
      if (pausaInicio && !pausaFin) estado = "en_pausa";
      else if (!salida) estado = "en_turno";
      else estado = "fuera_turno";
    }
    return { entrada: entrada ? new Date(entrada.fechaHora) : null, pausaInicio: pausaInicio ? new Date(pausaInicio.fechaHora) : null, pausaFin: pausaFin ? new Date(pausaFin.fechaHora) : null, salida: salida ? new Date(salida.fechaHora) : null, estado };
  }, [empleado]);

  const hoyFichajes = useMemo<FichajeDisplay[]>(() => {
    if (!empleado?.fichajes) return [];
    const today = timeRef.current;
    return empleado.fichajes
      .filter((f) => {
        const fd = new Date(f.fechaHora);
        return fd.getDate() === today.getDate() && fd.getMonth() === today.getMonth() && fd.getFullYear() === today.getFullYear();
      })
      .map((f) => ({ id: f.id, fechaHora: new Date(f.fechaHora), tipo: f.tipo as FichajeTipo, notas: f.notas }))
      .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
  }, [empleado]);

  const weeklyStats = useMemo(() => {
    if (!todosFichajes || !empleado) return { totalHoras: 0, promedioDiario: 0, diasTrabajados: 0, chartData: [] };
    const unaSemanaAtras = new Date(); unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
    const fichajesSemana = todosFichajes.filter((f) => new Date(f.fechaHora) >= unaSemanaAtras && f.empleadoId === empleado.id);
    const horasPorDia: Record<string, number> = {};
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    for (let i = 0; i < 7; i++) { const fecha = new Date(); fecha.setDate(fecha.getDate() - (6 - i)); horasPorDia[diasSemana[fecha.getDay()]] = 0; }
    fichajesSemana.forEach((f) => { if (f.tipo === "entrada") { const fd = new Date(f.fechaHora); horasPorDia[diasSemana[fd.getDay()]] += 0.5; } });
    const totalHoras = Object.values(horasPorDia).reduce((a, b) => a + b, 0);
    const diasTrabajados = Object.values(horasPorDia).filter((h) => h > 0).length;
    const chartData = Object.entries(horasPorDia).map(([dia, horas]) => ({ dia, horas: Math.round(horas * 10) / 10 }));
    return { totalHoras: Math.round(totalHoras * 10) / 10, promedioDiario: diasTrabajados > 0 ? Math.round((totalHoras / diasTrabajados) * 10) / 10 : 0, diasTrabajados, chartData };
  }, [todosFichajes, empleado]);

  const handleDigit = useCallback((digit: string) => { if (dni.length < 12) setDni((prev) => prev + digit); }, [dni]);
  const handleBackspace = useCallback(() => { setDni((prev) => prev.slice(0, -1)); }, []);
  const handleClear = useCallback(() => { setDni(""); setShowEmployeeCard(false); setNotFound(false); }, []);
  const handleSubmit = useCallback(async () => { 
    if (dni.length < 6) return; 
    setNotFound(false); 
    setShowEmployeeCard(false); 
    try { 
      const result = await refetchEmpleado(); 
      if (result.data) { setShowEmployeeCard(true); setNotFound(false); } 
      else { setNotFound(true); } 
    } catch { setNotFound(true); } 
  }, [dni, refetchEmpleado]);
  const handleFichaje = useCallback(async (tipo: FichajeTipo, notas?: string) => { 
    if (!empleado) return; 
    try { await createFichaje.mutateAsync({ empleadoId: empleado.id, tipo, notas }); await refetchEmpleado(); } 
    catch (e) { console.error(e); } 
  }, [empleado, createFichaje, refetchEmpleado]);
  const handleFichajeWithNotes = useCallback((tipo: FichajeTipo) => { setPendingFichaje({ tipo }); setShowNotesModal(true); }, []);
  const handleNotesSubmit = useCallback(async (notas: string) => { 
    if (!pendingFichaje) return; 
    await handleFichaje(pendingFichaje.tipo, notas); 
    setShowNotesModal(false); 
    setPendingFichaje(null); 
  }, [pendingFichaje, handleFichaje]);

  const canCheckIn = !shiftInfo.entrada;
  const canCheckOut = shiftInfo.entrada && !shiftInfo.salida && !shiftInfo.pausaInicio;
  const canStartPause = shiftInfo.entrada && !shiftInfo.pausaInicio && !shiftInfo.salida;
  const canEndPause = shiftInfo.pausaInicio && !shiftInfo.pausaFin;

  return (
    <div className="min-h-screen" style={{ background: colors.bgBase }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ClockDisplay />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {!showEmployeeCard && !notFound && <DniKeypad value={dni} onDigit={handleDigit} onBackspace={handleBackspace} onClear={handleClear} onSubmit={handleSubmit} />}
            {notFound && (
              <div className="rounded-2xl p-6 border text-center" style={{ background: colors.bgSurface, borderColor: "rgba(232,81,74,0.3)" }}>
                <AlertCircle size={48} style={{ color: colors.danger }} className="mx-auto mb-3" />
                <h3 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.danger, marginBottom: spacing[2] }}>Empleado no encontrado</h3>
                <button onClick={handleClear} className="px-6 py-3 rounded-xl font-semibold" style={{ background: colors.accent, color: "#fff", fontFamily: fontFamily.dmSans }}>Volver a intentar</button>
              </div>
            )}
            {showEmployeeCard && empleado && (
              <div className="space-y-4">
                <ShiftCard empleado={empleado} shift={shiftInfo} />
                <div className="rounded-2xl p-5 border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
                  <h3 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing[4], textAlign: "center" }}>Registrar fichaje</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <FichajeButton tipo="entrada" onClick={() => handleFichajeWithNotes("entrada")} disabled={!canCheckIn} completed={!!shiftInfo.entrada} />
                    <FichajeButton tipo="pausa_inicio" onClick={() => handleFichajeWithNotes("pausa_inicio")} disabled={!canStartPause} completed={!!shiftInfo.pausaInicio} />
                    <FichajeButton tipo="pausa_fin" onClick={() => handleFichajeWithNotes("pausa_fin")} disabled={!canEndPause} completed={!!shiftInfo.pausaFin} />
                    <FichajeButton tipo="salida" onClick={() => handleFichajeWithNotes("salida")} disabled={!canCheckOut} completed={!!shiftInfo.salida} />
                  </div>
                </div>
                <button onClick={handleClear} className="w-full py-3 rounded-xl border font-medium" style={{ borderColor: colors.border, color: colors.textSecondary, fontFamily: fontFamily.dmSans }}>Cambiar empleado</button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {showEmployeeCard && (
              <div className="rounded-2xl p-5 border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary }}>Historial de hoy</h3>
                  <Calendar size={18} style={{ color: colors.textSecondary }} />
                </div>
                {hoyFichajes.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {hoyFichajes.map((f) => <HistoryItem key={f.id} fichaje={f} />)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock size={32} style={{ color: colors.textSecondary }} className="mx-auto mb-2" />
                    <p style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm, color: colors.textSecondary }}>Sin registros hoy</p>
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setShowStats(!showStats)} className="w-full flex items-center justify-between p-4 rounded-2xl border" style={{ background: colors.bgSurface, borderColor: colors.border }}>
              <span style={{ fontFamily: fontFamily.syne, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary }}>Estadisticas</span>
              {showStats ? <ChevronUp size={20} style={{ color: colors.textSecondary }} /> : <ChevronDown size={20} style={{ color: colors.textSecondary }} />}
            </button>
            {showStats && showEmployeeCard && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <StatsCard title="Horas totales" value={weeklyStats.totalHoras + "h"} subtitle="esta semana" icon={Clock} color={colors.accent} />
                  <StatsCard title="Promedio diario" value={weeklyStats.promedioDiario + "h"} subtitle="por dia" icon={TrendingUp} color={colors.success} />
                  <StatsCard title="Dias trabajados" value={weeklyStats.diasTrabajados} subtitle="esta semana" icon={BarChart3} color={colors.amber} />
                </div>
                <WeeklyChart data={weeklyStats.chartData} />
              </div>
            )}
          </div>
        </div>
      </div>
      <NotesModal isOpen={showNotesModal} onClose={() => { setShowNotesModal(false); setPendingFichaje(null); }} onSubmit={handleNotesSubmit} loading={createFichaje.isPending} />
    </div>
  );
}

