"use client";
import { useState, useMemo } from "react";
import { X, ArrowLeft, Loader2, CheckCircle2, Phone, CalendarDays, Sun, Sunset, Moon, Sparkles, CalendarCheck, Receipt, DollarSign, Edit2, Trash2 } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function Badge({ variant = "default", children, className = "" }: { variant?: "default" | "success" | "warning" | "violet" | "danger"; children: React.ReactNode; className?: string }) {
  const variants: Record<string, string> = {
    default: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-amber-500/10 text-amber-400",
    violet: "bg-violet-500/10 text-violet-400",
    danger: "bg-red-500/10 text-red-400"
  };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${variants[variant]} ${className}`}>{children}</span>;
}

function Avatar({ nombre, apellido, size = "lg" }: { nombre: string; apellido: string; size?: "sm" | "md" | "lg" }) {
  const initials = `${nombre[0]}${apellido[0]}`;
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base", lg: "w-14 h-14 text-xl" };
  return <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20`}>{initials}</div>;
}

interface SocioType { id: string; nombre: string; apellido: string; dni: string; telefono?: string | null; fechaNacimiento?: Date | string | null; planId: string; plan: { id: string; nombre: string; precio: number }; fechaInicio: Date; tieneDeuda: boolean; visitasMesActual?: number; pagos?: any[]; horarioEntrenamiento?: string | null; grupoMuscular?: string | null; objetivoCliente?: string | null }
interface PlanOption { id: string; nombre: string; duracionDias: number; precio: number }

interface ClienteModalProps {
  mode: "create" | "edit" | "view";
  socio?: SocioType | null;
  planes: PlanOption[];
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  onRegisterPayment?: () => void;
  isLoading: boolean;
}

export function ClienteModal({ mode, socio, planes, onClose, onSave, onDelete, onRegisterPayment, isLoading }: ClienteModalProps) {
  const [formData, setFormData] = useState({
    dni: socio?.dni || "",
    nombre: socio?.nombre || "",
    apellido: socio?.apellido || "",
    telefono: socio?.telefono || "",
    fechaNacimiento: socio?.fechaNacimiento ? new Date(socio.fechaNacimiento).toISOString().split("T")[0] : "",
    planId: socio?.planId || "",
    fechaInicio: socio ? new Date(socio.fechaInicio).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    horarioEntrenamiento: socio?.horarioEntrenamiento || "matutino",
    grupoMuscular: socio?.grupoMuscular || "",
    objetivoCliente: socio?.objetivoCliente || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const calculateAge = (fechaNacimiento: Date | string | null | undefined) => {
    if (!fechaNacimiento) return null;
    const today = new Date();
    const birth = new Date(fechaNacimiento);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const groupedPagos = useMemo(() => {
    if (!socio?.pagos) return [];
    const grupos: Record<string, any[]> = {};
    socio.pagos.forEach((pago) => {
      const key = `${pago.anio}-${pago.mes}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(pago);
    });
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]));
  }, [socio?.pagos]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isView && <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><ArrowLeft className="w-5 h-5" /></button>}
              <h2 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {mode === "create" ? "Nuevo Cliente" : isEdit ? "Editar Cliente" : "Ficha del Cliente"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isView && socio ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <div className="flex items-start gap-5">
                  <Avatar nombre={socio.nombre} apellido={socio.apellido} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{socio.nombre} {socio.apellido}</h3>
                      <Badge variant={socio.tieneDeuda ? "warning" : "success"}>{socio.tieneDeuda ? "Con deuda" : "Al dia"}</Badge>
                    </div>
                    <p className="text-[var(--text-secondary)] font-mono">DNI {socio.dni}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--text-secondary)]">
                      {socio.telefono && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {socio.telefono}</span>}
                      {socio.fechaNacimiento && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(socio.fechaNacimiento).toLocaleDateString("es-AR")}
                          {calculateAge(socio.fechaNacimiento) && <span className="text-violet-400">({calculateAge(socio.fechaNacimiento)} anos)</span>}
                        </span>
                      )}
                    </div>
                    {socio.horarioEntrenamiento && (
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="violet">
                          {socio.horarioEntrenamiento === "matutino" && <Sun className="w-3 h-3" />}
                          {socio.horarioEntrenamiento === "vespertino" && <Sunset className="w-3 h-3" />}
                          {socio.horarioEntrenamiento === "nocturno" && <Moon className="w-3 h-3" />}
                          {socio.horarioEntrenamiento.charAt(0).toUpperCase() + socio.horarioEntrenamiento.slice(1)}
                        </Badge>
                        {socio.grupoMuscular && <Badge>{socio.grupoMuscular}</Badge>}
                        {socio.objetivoCliente && <Badge>{socio.objetivoCliente}</Badge>}
                      </div>
                    )}
                    <p className="text-sm text-[var(--text-secondary)] mt-3">Cliente desde <span className="text-violet-400">{new Date(socio.fechaInicio).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                  <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Plan</p>
                  <p className="font-semibold">{socio.plan.nombre}</p>
                  <p className="text-xs text-[var(--text-secondary)]">${socio.plan.precio}/mes</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                  <CalendarCheck className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Visitas</p>
                  <p className="font-semibold text-lg">{socio.visitasMesActual || 0}</p>
                  <p className="text-xs text-[var(--text-secondary)]">este mes</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                  <Receipt className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Total</p>
                  <p className="font-semibold text-lg">{socio.pagos?.length || 0}</p>
                  <p className="text-xs text-[var(--text-secondary)]">pagos</p>
                </div>
              </div>

              {groupedPagos.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Historial de Pagos</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {groupedPagos.slice(0, 6).map(([key, pagos]) => {
                      const [anio, mes] = key.split("-");
                      const total = pagos.reduce((sum: number, p: any) => sum + p.monto, 0);
                      return (
                        <div key={key} className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{MESES[parseInt(mes) - 1]} {anio}</span>
                            <span className="font-bold text-violet-400">${total.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pagos.map((pago: any) => (
                              <span key={pago.id} className={`text-xs px-2 py-1 rounded ${pago.metodo === "efectivo" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                                ${pago.monto} - {pago.metodo}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {onRegisterPayment && (
                  <button onClick={onRegisterPayment} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors">
                    <DollarSign className="w-4 h-4" />Registrar Pago
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors font-medium">
                  <Edit2 className="w-4 h-4" />Editar
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(socio.id)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "create" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">DNI <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.dni} onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: 12345678" required />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Nombre <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Apellido <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.apellido} onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Telefono</label>
                <input type="text" value={formData.telefono} onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" placeholder="Ej: 5491112345678" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Fecha de nacimiento</label>
                  <input type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Fecha de inicio</label>
                  <input type="date" value={formData.fechaInicio} onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Plan <span className="text-red-400">*</span></label>
                <select value={formData.planId} onChange={(e) => setFormData((prev) => ({ ...prev, planId: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" required>
                  <option value="">Seleccionar plan...</option>
                  {planes.map((plan) => (<option key={plan.id} value={plan.id}>{plan.nombre} - ${plan.precio}/mes ({plan.duracionDias} dias)</option>))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Horario</label>
                  <select value={formData.horarioEntrenamiento} onChange={(e) => setFormData((prev) => ({ ...prev, horarioEntrenamiento: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="nocturno">Nocturno</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Grupo Muscular</label>
                  <select value={formData.grupoMuscular} onChange={(e) => setFormData((prev) => ({ ...prev, grupoMuscular: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                    <option value="">Sin asignar</option>
                    <option value="pecho">Pecho</option>
                    <option value="espalda">Espalda</option>
                    <option value="piernas">Piernas</option>
                    <option value="brazos">Brazos</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Objetivo</label>
                <select value={formData.objetivoCliente} onChange={(e) => setFormData((prev) => ({ ...prev, objetivoCliente: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                  <option value="">Sin objetivo</option>
                  <option value="perdida_peso">Perdida de peso</option>
                  <option value="musculo">Ganar musculo</option>
                  <option value="tonificar">Tonificar</option>
                  <option value="resistencia">Mejorar resistencia</option>
                  <option value="flexibilidad">Mejorar flexibilidad</option>
                  <option value="salud">Salud general</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors font-medium">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>) : (<><CheckCircle2 className="w-4 h-4" /> {mode === "create" ? "Crear Cliente" : "Guardar Cambios"}</>)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
