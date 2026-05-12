export type PlanType = { id?: string; nombre: string; duracionDias: number; precio: number };

type Plan = {
  id: string;
  nombre: string;
  duracionDias: number;
  precio: number;
  createdAt: Date;
  updatedAt: Date;
};

type Socio = {
  id: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  fechaNacimiento: Date | null;
  fotoUrl: string | null;
  planId: string;
  fechaInicio: Date;
  horarioEntrenamiento: string;
  grupoMuscular: string | null;
  objetivoCliente: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Pago = {
  id: string;
  socioId: string;
  monto: number;
  metodo: string;
  fechaPago: Date;
  mes: number;
  anio: number;
  createdAt: Date;
};

type Fichaje = {
  id: string;
  socioId: string | null;
  empleadoId: string | null;
  fechaHora: Date;
  tipo: string;
  notas: string | null;
  createdAt: Date;
};

export type SocioConEstado = Socio & {
  plan: Plan;
  pagos: Pago[];
  fichajes: Fichaje[];
  tieneDeuda: boolean;
  venceEn?: number;
  visitasMesActual?: number;
};

export type MembershipStatus = 'vigente' | 'porVencer' | 'vencida';

export type GroupByOption = 'plan' | 'horario' | 'grupoMuscular' | 'estado';

export type HorarioType = 'matutino' | 'vespertino' | 'nocturno';

export type GrupoMuscularType = 'pecho' | 'espalda' | 'piernas' | 'brazos' | 'core' | 'cardio';

export const HORARIOS: HorarioType[] = ['matutino', 'vespertino', 'nocturno'];

export const GRUPOS_MUSCULARES: GrupoMuscularType[] = [
  'pecho',
  'espalda',
  'piernas',
  'brazos',
  'core',
  'cardio',
];

export const HORARIO_LABELS: Record<HorarioType, string> = {
  matutino: 'Matutino',
  vespertino: 'Vespertino',
  nocturno: 'Nocturno',
};

export const GRUPO_MUSCULAR_LABELS: Record<GrupoMuscularType, string> = {
  pecho: 'Pecho',
  espalda: 'Espalda',
  piernas: 'Piernas',
  brazos: 'Brazos',
  core: 'Core',
  cardio: 'Cardio',
};

export type GroupedData = {
  plan: Record<string, SocioConEstado[]>;
  horario: Record<HorarioType, SocioConEstado[]>;
  grupoMuscular: Record<string, SocioConEstado[]>;
  estado: {
    vigentes: SocioConEstado[];
    porVencer: SocioConEstado[];
    vencidas: SocioConEstado[];
  };
};
