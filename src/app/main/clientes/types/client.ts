import type { Socio, Plan, Pago, Fichaje } from '@prisma/client';

export type PlanType = { id?: string; nombre: string; duracionDias: number; precio: number };

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
