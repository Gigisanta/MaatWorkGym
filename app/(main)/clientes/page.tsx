"use client";

import { useState, useMemo } from "react";
import {
  useSocios,
  useCreateSocio,
  useUpdateSocio,
  useDeleteSocio,
  useSocioById,
} from "@/hooks/useSocios";
import { usePagos, useCreatePago } from "@/hooks/usePagos";
import { usePlanes } from "@/hooks/usePlanes";
import {
  Users,
  Search,
  Plus,
  X,
  Calendar,
  DollarSign,
  Clock,
  Trash2,
  Edit2,
  User,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Receipt,
  CalendarCheck,
  Loader2,
  Sparkles,
  LayoutGrid,
  List,
  Crown,
} from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type ModalTab = "info" | "payments" | "attendance";

// Types - Socio matches SocioConEstado from hooks (Socio from Prisma + extra fields)
type Socio = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string | null;
  fechaNacimiento: Date | null;
  planId: string;
  plan: { id: string; nombre: string; precio: number };
  fechaInicio: Date;
  tieneDeuda: boolean;
  visitasMesActual?: number;
  pagos: Pago[];
  fichajes: Fichaje[];
};

type Pago = {
  id: string;
  socioId: string;
  monto: number;
  metodo: string;
  mes: number;
  anio: number;
  fechaPago: Date;
};

type Fichaje = {
  id: string;
  socioId: string;
  fechaHora: Date;
};

type Plan = {
  id: string;
  nombre: string;
  precio: number;
};

// ============================================================================
// Badge Component
// ============================================================================

function Badge({ variant = "default", children, className = "" }: { variant?: "default" | "success" | "warning" | "violet"; children: React.ReactNode; className?: string; }) {
  const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium " + className;
  const variants: Record<string, string> = {
    default: "bg-[var(--badge)] text-[var(--badge-foreground)]",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ============================================================================
// Avatar Component
// ============================================================================

function Avatar({ nombre, apellido, tieneDeuda }: { nombre: string; apellido: string; tieneDeuda: boolean }) {
  const initials = `${nombre[0]}${apellido[0]}`;
  return (
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-violet-500/20">
        {initials}
      </div>
      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-card)] ${tieneDeuda ? "bg-amber-500" : "bg-emerald-500"}`} />
    </div>
  );
}

// ============================================================================
// SocioCard Component
// ============================================================================

function SocioCard({ socio, onClick }: { socio: Socio; onClick: () => void }) {
  const joinDate = new Date(socio.fechaInicio).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-violet-500/40 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Avatar nombre={socio.nombre} apellido={socio.apellido} tieneDeuda={socio.tieneDeuda} />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">
            {socio.nombre} {socio.apellido}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-mono">DNI {socio.dni}</p>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1 shrink-0">
          <Badge variant="violet">
            <Sparkles className="w-3 h-3" />
            {socio.plan.nombre}
          </Badge>
          <p className="text-xs text-[var(--text-secondary)]">Desde {joinDate}</p>
        </div>

        <div className="shrink-0">
          <Badge variant={socio.tieneDeuda ? "warning" : "success"}>
            {socio.tieneDeuda ? (
              <><AlertCircle className="w-3 h-3" /> DEBE</>
            ) : (
              <><CheckCircle2 className="w-3 h-3" /> AL DÍA</>
            )}
          </Badge>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// Client Modal
// ============================================================================

function ClientModal({
  socio,
  onClose,
  onEdit,
  onDelete,
  onRegisterPayment,
}: {
  socio: Socio;
  pagos: Pago[];
  planes: Plan[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onRegisterPayment: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ModalTab>("info");

  const tabs: { id: ModalTab; label: string; icon: React.ReactNode }[] = [
    { id: "info", label: "Info", icon: <User className="w-4 h-4" /> },
    { id: "payments", label: "Pagos", icon: <DollarSign className="w-4 h-4" /> },
    { id: "attendance", label: "Asistencia", icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Ficha del Cliente
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 rounded-lg bg-[var(--bg-secondary)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--bg-card)] shadow-sm text-violet-400"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "info" && (
            <InfoTab socio={socio} onEdit={onEdit} onDelete={onDelete} />
          )}
          {activeTab === "payments" && <PaymentsTab socio={socio} />}
          {activeTab === "attendance" && <AttendanceTab socio={socio} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
          <button
            onClick={onRegisterPayment}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            Registrar Pago
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Info Tab
// ============================================================================

function InfoTab({ socio, onEdit, onDelete }: { socio: Socio; onEdit: () => void; onDelete: (id: string) => void }) {
  const initials = `${socio.nombre[0]}${socio.apellido[0]}`;

  const calculateAge = (fechaNacimiento: Date | string | null | undefined) => {
    if (!fechaNacimiento) return null;
    const today = new Date();
    const birth = new Date(fechaNacimiento);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {socio.nombre} {socio.apellido}
              </h3>
              <Badge variant={socio.tieneDeuda ? "warning" : "success"}>
                {socio.tieneDeuda ? "Con deuda" : "Al día"}
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] font-mono">DNI {socio.dni}</p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--text-secondary)]">
              {socio.telefono && <span>Tel: {socio.telefono}</span>}
              {socio.fechaNacimiento && (
                <span>
                  Nac: {new Date(socio.fechaNacimiento).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {calculateAge(socio.fechaNacimiento) && (
                    <span className="text-violet-400 ml-1">({calculateAge(socio.fechaNacimiento)} años)</span>
                  )}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Cliente desde{" "}
              <span className="text-violet-400">
                {new Date(socio.fechaInicio).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-1">Plan</p>
          <p className="font-semibold text-[var(--text-primary)]">{socio.plan.nombre}</p>
          <p className="text-xs text-[var(--text-secondary)]">${socio.plan.precio}/mes</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-1">Visitas</p>
          <p className="font-semibold text-lg text-[var(--text-primary)]">{socio.visitasMesActual || 0}</p>
          <p className="text-xs text-[var(--text-secondary)]">este mes</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-1">Total</p>
          <p className="font-semibold text-lg text-[var(--text-primary)]">{socio.pagos?.length || 0}</p>
          <p className="text-xs text-[var(--text-secondary)]">pagos</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(socio.id)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Payments Tab
// ============================================================================

function PaymentsTab({ socio }: { socio: Socio }) {
  const groupedPagos = useMemo(() => {
    const grupos: Record<string, Pago[]> = {};
    (socio.pagos || []).forEach((pago) => {
      const key = `${pago.anio}-${pago.mes}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(pago);
    });
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]));
  }, [socio]);

  if (groupedPagos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
          <Receipt className="w-8 h-8 text-[var(--text-secondary)]" />
        </div>
        <p className="text-[var(--text-secondary)]">Sin pagos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedPagos.map(([key, pagos]) => {
        const [anio, mes] = key.split("-");
        const total = pagos.reduce((sum, p) => sum + p.monto, 0);

        return (
          <div key={key} className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-semibold">
                  {MESES[parseInt(mes) - 1]} {anio}
                </span>
              </div>
              <span className="font-bold text-violet-400">
                ${total.toLocaleString()}
              </span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {pagos.map((pago) => (
                <div key={pago.id} className="px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-card)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      pago.metodo === "efectivo"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {pago.metodo === "efectivo" ? (
                        <DollarSign className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">${pago.monto.toLocaleString()}</p>
                      <p className="text-xs text-[var(--text-secondary)] capitalize">{pago.metodo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(pago.fechaPago).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {new Date(pago.fechaPago).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Attendance Tab
// ============================================================================

function AttendanceTab({ socio }: { socio: Socio }) {
  const groupedByDate = useMemo(() => {
    const grupos: Record<string, Fichaje[]> = {};
    (socio.fichajes || []).forEach((fichaje) => {
      const date = new Date(fichaje.fechaHora).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      if (!grupos[date]) grupos[date] = [];
      grupos[date].push(fichaje);
    });
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]));
  }, [socio]);

  if (groupedByDate.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
          <Clock className="w-8 h-8 text-[var(--text-secondary)]" />
        </div>
        <p className="text-[var(--text-secondary)]">Sin registros de asistencia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedByDate.slice(0, 12).map(([date, dayFichajes]) => (
        <div key={date} className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="font-medium text-sm">{date}</span>
            <span className="ml-auto text-xs text-[var(--text-secondary)]">
              {dayFichajes.length} {dayFichajes.length === 1 ? "visita" : "visitas"}
            </span>
          </div>

          <div className="p-3 flex flex-wrap gap-2">
            {dayFichajes.map((fichaje) => {
              const hour = new Date(fichaje.fechaHora).getHours();
              const isMorning = hour < 12;
              const isAfternoon = hour >= 12 && hour < 18;

              return (
                <div
                  key={fichaje.id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isMorning
                      ? "bg-amber-500/10 text-amber-400"
                      : isAfternoon
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-violet-500/10 text-violet-400"
                  }`}
                >
                  {new Date(fichaje.fechaHora).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {groupedByDate.length > 12 && (
        <p className="text-center text-sm text-[var(--text-secondary)] py-2">
          Mostrando 12 de {groupedByDate.length} días con asistencia
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Add Client Modal
// ============================================================================

function AddClientModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <AddClientForm onClose={onClose} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

function AddClientForm({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    planId: "",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const { data: planes } = usePlanes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Nuevo Socio</h2>
              <p className="text-sm text-[var(--text-secondary)]">Complete los datos del cliente</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">DNI <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
            placeholder="Ej: 12345678"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nombre <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Apellido <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Plan <span className="text-red-400">*</span></label>
          <select
            value={formData.planId}
            onChange={(e) => setFormData((prev) => ({ ...prev, planId: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
            required
          >
            <option value="">Seleccionar plan...</option>
            {planes?.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre} - ${plan.precio}/mes
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Fecha de inicio</label>
          <input
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors font-medium">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Crear Socio</>
          )}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Payment Modal
// ============================================================================

function PaymentModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  socioId: string;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
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
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Registrar Pago</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Complete los datos del pago</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Monto ($) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                <input
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monto: e.target.value }))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="Ej: 5000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, metodo: "efectivo" }))}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.metodo === "efectivo"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"
                  }`}
                >
                  <DollarSign className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, metodo: "transferencia" }))}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.metodo === "transferencia"
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                      : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Transferencia</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mes</label>
                <select
                  value={formData.mes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mes: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                >
                  {MESES.map((mes, i) => (
                    <option key={i} value={i + 1}>{mes}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Año</label>
                <select
                  value={formData.anio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, anio: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                >
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors font-medium">
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading || !formData.monto}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Confirmar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Edit Client Modal
// ============================================================================

function EditClientModal({
  socio,
  onClose,
  onSaveData,
  isLoading,
}: {
  socio: Socio;
  onClose: () => void;
  onSaveData: (data: { nombre: string; apellido: string; planId: string; telefono: string; fechaNacimiento: string }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    nombre: socio.nombre,
    apellido: socio.apellido,
    planId: socio.planId,
    telefono: socio.telefono || "",
    fechaNacimiento: socio.fechaNacimiento
      ? new Date(socio.fechaNacimiento).toISOString().split("T")[0]
      : "",
  });

  const { data: planes } = usePlanes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Editar Socio</h2>
                  <p className="text-sm text-[var(--text-secondary)]">{socio.nombre} {socio.apellido}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
                placeholder="Ej: 5491112345678"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Fecha de nacimiento</label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Plan</label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData((prev) => ({ ...prev, planId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
              >
                {planes?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - ${plan.precio}/mes
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors font-medium">
              Cancelar
            </button>
            <button
              onClick={() => onSaveData(formData)}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Guardar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSocioId, setSelectedSocioId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grouped" | "list">("grouped");

  const { data: socios, isLoading } = useSocios(search);
  const { data: pagos } = usePagos();
  const { data: planes } = usePlanes();
  const createSocio = useCreateSocio();
  const updateSocio = useUpdateSocio();
  const deleteSocio = useDeleteSocio();
  const createPago = useCreatePago();

  const { data: socioDetalle } = useSocioById(selectedSocioId);

  const [newSocio, setNewSocio] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    planId: "",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const [nuevoPago, setNuevoPago] = useState({
    monto: "",
    metodo: "efectivo" as "efectivo" | "transferencia",
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  const groupedSocios = useMemo(() => {
    if (!socios || !planes) return {};

    const groups: Record<string, typeof socios> = {};
    planes.forEach((plan) => {
      groups[plan.id] = [];
    });

    socios.forEach((socio) => {
      if (groups[socio.planId]) {
        groups[socio.planId].push(socio);
      }
    });

    Object.keys(groups).forEach((planId) => {
      groups[planId].sort((a, b) =>
        a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre)
      );
    });

    return groups;
  }, [socios, planes]);

  const handleCreateSocio = async () => {
    if (!newSocio.nombre || !newSocio.apellido || !newSocio.dni || !newSocio.planId) return;

    try {
      await createSocio.mutateAsync(newSocio);
      setShowAddModal(false);
      setNewSocio({
        nombre: "",
        apellido: "",
        dni: "",
        planId: "",
        fechaInicio: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error al crear socio:", err);
    }
  };

  const handleRegistrarPago = async () => {
    if (!showPagoModal || !nuevoPago.monto) return;

    try {
      await createPago.mutateAsync({
        socioId: showPagoModal,
        monto: parseFloat(nuevoPago.monto),
        metodo: nuevoPago.metodo,
        mes: nuevoPago.mes,
        anio: nuevoPago.anio,
      });
      setShowPagoModal(null);
      setNuevoPago({
        monto: "",
        metodo: "efectivo",
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear(),
      });
    } catch (err) {
      console.error("Error al registrar pago:", err);
    }
  };

  const handleDeleteSocio = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este socio? Esta acción no se puede deshacer.")) return;
    try {
      await deleteSocio.mutateAsync(id);
      setSelectedSocioId(null);
    } catch (err) {
      console.error("Error al eliminar socio:", err);
    }
  };

  const handleSaveEdit = async (formData: { nombre: string; apellido: string; planId: string; telefono: string; fechaNacimiento: string }) => {
    if (!selectedSocioId) return;
    try {
      await updateSocio.mutateAsync({
        id: selectedSocioId,
        data: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          planId: formData.planId,
          telefono: formData.telefono || null,
          fechaNacimiento: formData.fechaNacimiento || null,
        },
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Error al actualizar socio:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Clientes
            </h1>
            <p className="text-[var(--text-secondary)]">
              {socios?.length || 0} {socios?.length === 1 ? "cliente" : "clientes"} registrados
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-5 h-5" />
            Nuevo Socio
          </button>
        </div>

        {/* Search & View Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, apellido o DNI..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <button
              onClick={() => setViewMode("grouped")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grouped"
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              title="Agrupado por plan"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              title="Lista simple"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : socios && socios.length > 0 ? (
          viewMode === "grouped" ? (
            <div className="space-y-8">
              {planes?.map((plan) => {
                const planSocios = groupedSocios[plan.id] || [];
                if (planSocios.length === 0) return null;
                return (
                  <div key={plan.id} className="space-y-3">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10 border border-violet-500/20">
                        {plan.nombre.includes("Anual") ? (
                          <Crown className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-violet-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{plan.nombre}</h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {planSocios.length} {planSocios.length === 1 ? "cliente" : "clientes"}
                        </p>
                      </div>
                      <Badge variant="violet" className="ml-auto">
                        ${plan.precio.toLocaleString()}
                      </Badge>
                    </div>

                    {/* Clients */}
                    <div className="space-y-2 pl-4 border-l-2 border-[var(--border)]">
                      {planSocios.map((socio) => (
                        <SocioCard
                          key={socio.id}
                          socio={socio}
                          onClick={() => setSelectedSocioId(socio.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {socios.map((socio) => (
                <SocioCard
                  key={socio.id}
                  socio={socio}
                  onClick={() => setSelectedSocioId(socio.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center">
              <Users className="w-10 h-10 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              No hay clientes registrados
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">Comienza agregando tu primer cliente al sistema</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Cliente
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateSocio}
          isLoading={createSocio.isPending}
        />
      )}

      {showPagoModal && (
        <PaymentModal
          socioId={showPagoModal}
          onClose={() => setShowPagoModal(null)}
          onSubmit={handleRegistrarPago}
          isLoading={createPago.isPending}
        />
      )}

      {selectedSocioId && socioDetalle && (
        <ClientModal
          socio={socioDetalle}
          pagos={pagos || []}
          planes={planes || []}
          onClose={() => setSelectedSocioId(null)}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDeleteSocio}
          onRegisterPayment={() => {
            setShowPagoModal(socioDetalle.id);
          }}
        />
      )}

      {showEditModal && socioDetalle && (
        <EditClientModal
          socio={socioDetalle}
          onClose={() => setShowEditModal(false)}
          onSaveData={handleSaveEdit}
          isLoading={updateSocio.isPending}
        />
      )}
    </div>
  );
}
