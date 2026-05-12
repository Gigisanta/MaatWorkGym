import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Rutina = {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  socioId: string | null;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DiaRutina = {
  id: string;
  rutinaId: string;
  diaSemana: number;
  nombre: string | null;
  orden: number;
};

type EjercicioRutina = {
  id: string;
  diaRutinaId: string;
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: string;
  grupoMuscular: string | null;
  nota: string | null;
  orden: number;
};

type AsignacionRutina = {
  id: string;
  rutinaId: string;
  socioId: string;
  parametros: string | null;
  token: string;
  createdAt: Date;
};

type RutinaCompleta = Rutina & {
  socio: { id: string; nombre: string; apellido: string } | null;
  dias: (DiaRutina & {
    ejercicios: EjercicioRutina[];
  })[];
  asignaciones: (AsignacionRutina & {
    socio: { id: string; nombre: string; apellido: string };
  })[];
};

type EjercicioInput = {
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: string;
  grupoMuscular?: string;
  nota?: string;
  orden: number;
};

type DiaInput = {
  diaSemana: number;
  nombre?: string;
  ejercicios: EjercicioInput[];
  orden: number;
};

async function fetchRutinas(tipo?: string): Promise<RutinaCompleta[]> {
  const url = tipo ? `/api/rutinas?tipo=${tipo}` : '/api/rutinas';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener rutinas');
  return res.json();
}

async function fetchRutinaById(id: string): Promise<RutinaCompleta> {
  const res = await fetch(`/api/rutinas/${id}`);
  if (!res.ok) throw new Error('Error al obtener rutina');
  return res.json();
}

async function createRutina(data: {
  nombre: string;
  descripcion?: string;
  tipo?: string;
  socioId?: string;
  dias: DiaInput[];
}): Promise<RutinaCompleta> {
  const res = await fetch('/api/rutinas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear rutina');
  }
  return res.json();
}

async function updateRutina(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    socioId?: string;
    dias: DiaInput[];
  }
): Promise<RutinaCompleta> {
  const res = await fetch(`/api/rutinas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar rutina');
  return res.json();
}

async function deleteRutina(id: string): Promise<void> {
  const res = await fetch(`/api/rutinas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar rutina');
}

async function asignarRutina(data: {
  rutinaId: string;
  socioId: string;
  parametros?: Record<string, any>;
}): Promise<AsignacionRutina & { rutina: RutinaCompleta; socio: { id: string; nombre: string; apellido: string } }> {
  const res = await fetch('/api/asignaciones/rutina', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al asignar rutina');
  return res.json();
}

async function fetchAsignaciones(socioId?: string): Promise<(AsignacionRutina & { rutina: RutinaCompleta; socio: { id: string; nombre: string; apellido: string } })[]> {
  const url = socioId ? `/api/asignaciones/rutina?socioId=${socioId}` : '/api/asignaciones/rutina';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener asignaciones');
  return res.json();
}

export function useRutinas(tipo?: string) {
  return useQuery({
    queryKey: ['rutinas', tipo],
    queryFn: () => fetchRutinas(tipo),
  });
}

export function useRutina(id: string | null) {
  return useQuery({
    queryKey: ['rutina', id],
    queryFn: () => fetchRutinaById(id!),
    enabled: !!id,
  });
}

export function useCreateRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
    },
  });
}

export function useUpdateRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateRutina>[1] }) =>
      updateRutina(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      queryClient.invalidateQueries({ queryKey: ['rutina', id] });
    },
  });
}

export function useDeleteRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
    },
  });
}

export function useAsignarRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: asignarRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
    },
  });
}

export function useAsignaciones(socioId?: string) {
  return useQuery({
    queryKey: ['asignaciones', 'rutina', socioId],
    queryFn: () => fetchAsignaciones(socioId),
  });
}