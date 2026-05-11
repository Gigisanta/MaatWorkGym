'use client';
import { useState, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Phone,
  CalendarDays,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Receipt,
  DollarSign,
  Edit2,
  Trash2,
  User,
  Fingerprint,
  Activity,
  Target,
  Hash,
  Clock,
  Dumbbell,
  Heart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PagoType {
  id: string;
  monto: number;
  mes: number;
  anio: number;
  fechaPago: Date;
  metodo?: string;
}

interface SocioType {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string | null;
  fechaNacimiento?: Date | string | null;
  planId: string;
  plan: { id: string; nombre: string; precio: number };
  fechaInicio: Date;
  tieneDeuda: boolean;
  visitasMesActual?: number;
  pagos?: PagoType[];
  horarioEntrenamiento?: string | null;
  grupoMuscular?: string | null;
  objetivoCliente?: string | null;
}

interface PlanOption {
  id: string;
  nombre: string;
  duracionDias: number;
  precio: number;
}

interface FormDataType {
  dni: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: string;
  planId: string;
  fechaInicio: string;
  horarioEntrenamiento?: string;
  grupoMuscular?: string;
  objetivoCliente?: string;
}

interface ClienteModalProps {
  mode: 'create' | 'edit' | 'view';
  socio?: SocioType | null;
  planes: PlanOption[];
  onClose: () => void;
  onSave: (data: FormDataType) => void;
  onDelete?: (id: string) => void;
  onRegisterPayment?: () => void;
  isLoading: boolean;
}

export function ClienteModal({
  mode,
  socio,
  planes,
  onClose,
  onSave,
  onDelete,
  onRegisterPayment,
  isLoading,
}: ClienteModalProps) {
  const [formData, setFormData] = useState({
    dni: socio?.dni || '',
    nombre: socio?.nombre || '',
    apellido: socio?.apellido || '',
    telefono: socio?.telefono || '',
    fechaNacimiento: socio?.fechaNacimiento
      ? new Date(socio.fechaNacimiento).toISOString().split('T')[0]
      : '',
    planId: socio?.planId || '',
    fechaInicio: socio
      ? new Date(socio.fechaInicio).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    horarioEntrenamiento: socio?.horarioEntrenamiento || 'matutino',
    grupoMuscular: socio?.grupoMuscular || '',
    objetivoCliente: socio?.objetivoCliente || '',
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

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-2xl bg-card border border-border shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isView && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {mode === 'create' ? 'Nuevo Socio' : isEdit ? 'Editar Perfil' : 'Expediente del Socio'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Módulo de Gestión
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {isView && socio ? (
              <div className="space-y-6">
                {/* Profile Banner */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center font-semibold text-2xl text-white bg-gradient-to-br from-primary to-blue-500 shrink-0">
                      {socio.nombre[0]}{socio.apellido[0]}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {socio.nombre} {socio.apellido}
                        </h3>
                        <Badge className={cn(
                          socio.tieneDeuda
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-success/10 text-success border-success/20"
                        )}>
                          {socio.tieneDeuda ? 'Deuda Pendiente' : 'Suscripción Activa'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Fingerprint size={14} className="text-primary" />
                          <span>DNI {socio.dni}</span>
                        </div>
                        {socio.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary" />
                            <span>{socio.telefono}</span>
                          </div>
                        )}
                        {socio.fechaNacimiento && (
                          <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-primary" />
                            <span>
                              {new Date(socio.fechaNacimiento).toLocaleDateString('es-AR')}
                              <span className="text-primary ml-1">
                                ({calculateAge(socio.fechaNacimiento)} años)
                              </span>
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-primary" />
                          <span className="capitalize">{socio.horarioEntrenamiento || 'No definido'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                    <Sparkles size={16} className="text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Membresía</p>
                    <p className="text-sm font-medium text-foreground">{socio.plan.nombre}</p>
                    <p className="text-xs text-primary">${socio.plan.precio}/mes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                    <Activity size={16} className="text-success mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Visitas</p>
                    <p className="text-xl font-semibold text-foreground">{socio.visitasMesActual || 0}</p>
                    <p className="text-xs text-success">Este mes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                    <Receipt size={16} className="text-warning mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Historial</p>
                    <p className="text-xl font-semibold text-foreground">{socio.pagos?.length || 0}</p>
                    <p className="text-xs text-warning">Pagos totales</p>
                  </div>
                </div>

                {/* Training Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                    <Dumbbell size={18} className="text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Grupo Muscular</p>
                      <p className="text-sm font-medium text-foreground capitalize">{socio.grupoMuscular || 'No especificado'}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                    <Target size={18} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Objetivo</p>
                      <p className="text-sm font-medium text-foreground capitalize">{socio.objetivoCliente?.replace('_', ' ') || 'General'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {onRegisterPayment && (
                    <button
                      onClick={onRegisterPayment}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors"
                    >
                      <DollarSign size={16} />
                      Registrar Pago
                    </button>
                  )}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-muted border border-border text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    <Edit2 size={16} />
                    Editar Perfil
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(socio.id)}
                      className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-colors"
                      aria-label="Eliminar socio"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" id="cliente-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mode === 'create' && (
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="dni" className="text-sm font-medium text-foreground">
                        Documento Nacional de Identidad (DNI) *
                      </label>
                      <div className="relative">
                        <input
                          id="dni"
                          type="text"
                          value={formData.dni}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                          placeholder="Ej: 40123456"
                          required
                        />
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                      Nombre *
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="apellido" className="text-sm font-medium text-foreground">
                      Apellido *
                    </label>
                    <input
                      id="apellido"
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="telefono" className="text-sm font-medium text-foreground">
                      Teléfono de Contacto
                    </label>
                    <div className="relative">
                      <input
                        id="telefono"
                        type="text"
                        value={formData.telefono}
                        onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                        placeholder="Ej: 5491112345678"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fechaNacimiento" className="text-sm font-medium text-foreground">
                      Fecha de Nacimiento
                    </label>
                    <input
                      id="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="fechaInicio" className="text-sm font-medium text-foreground">
                      Fecha de Alta
                    </label>
                    <input
                      id="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="planId" className="text-sm font-medium text-foreground">
                      Plan de Suscripción *
                    </label>
                    <select
                      id="planId"
                      value={formData.planId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, planId: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      required
                      aria-label="Seleccionar plan de suscripción"
                    >
                      <option value="">Seleccionar plan...</option>
                      {planes.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.nombre} — ${plan.precio}/mes ({plan.duracionDias} días)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Franja Horaria
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'matutino', label: 'Matutino', icon: <Sun size={14} /> },
                        { id: 'vespertino', label: 'Vespertino', icon: <Sunset size={14} /> },
                        { id: 'nocturno', label: 'Nocturno', icon: <Moon size={14} /> },
                      ].map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, horarioEntrenamiento: h.id }))}
                          className={cn(
                            "py-3 px-2 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1",
                            formData.horarioEntrenamiento === h.id
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                          )}
                          aria-pressed={formData.horarioEntrenamiento === h.id}
                        >
                          {h.icon}
                          <span className="text-xs">{h.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="grupoMuscular" className="text-sm font-medium text-foreground">
                      Enfoque Muscular
                    </label>
                    <select
                      id="grupoMuscular"
                      value={formData.grupoMuscular}
                      onChange={(e) => setFormData((prev) => ({ ...prev, grupoMuscular: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      aria-label="Seleccionar enfoque muscular"
                    >
                      <option value="">General / Todo el cuerpo</option>
                      <option value="pecho">Tren Superior: Pecho</option>
                      <option value="espalda">Tren Superior: Espalda</option>
                      <option value="brazos">Tren Superior: Brazos</option>
                      <option value="piernas">Tren Inferior: Piernas</option>
                      <option value="core">Zona Media: Core</option>
                      <option value="cardio">Resistencia: Cardio</option>
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Objetivo Principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'perdida_peso', label: 'Perder Peso', icon: <Activity size={14} /> },
                        { id: 'musculo', label: 'Ganar Músculo', icon: <Dumbbell size={14} /> },
                        { id: 'tonificar', label: 'Tonificar', icon: <Target size={14} /> },
                        { id: 'resistencia', label: 'Resistencia', icon: <Clock size={14} /> },
                        { id: 'salud', label: 'Salud', icon: <Heart size={14} /> },
                      ].map((obj) => (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, objetivoCliente: obj.id }))}
                          className={cn(
                            "py-3 px-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                            formData.objetivoCliente === obj.id
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                          )}
                          aria-pressed={formData.objetivoCliente === obj.id}
                        >
                          {obj.icon}
                          <span className="truncate text-xs">{obj.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-lg bg-muted border border-border text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        {mode === 'create' ? 'Confirmar Alta' : 'Guardar Cambios'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
