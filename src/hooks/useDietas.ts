import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Dieta, Comida, ItemComida, AsignacionDieta } from '@prisma/client';

type DietaCompleta = Dieta & {
  socio: { id: string; nombre: string; apellido: string } | null;
  comidas: (Comida & {
    items: ItemComida[];
  })[];
  asignaciones: (AsignacionDieta & {
    socio: { id: string; nombre: string; apellido: string };
  })[];
};

type ItemComidaInput = {
  alimento: string;
  cantidad: string;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  orden: number;
};

type ComidaInput = {
  nombre: string;
  hora: string;
  items: ItemComidaInput[];
  orden: number;
};

async function fetchDietas(tipo?: string): Promise<DietaCompleta[]> {
  const url = tipo ? `/api/dietas?tipo=${tipo}` : '/api/dietas';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener dietas');
  return res.json();
}

async function fetchDietaById(id: string): Promise<DietaCompleta> {
  const res = await fetch(`/api/dietas/${id}`);
  if (!res.ok) throw new Error('Error al obtener dieta');
  return res.json();
}

async function createDieta(data: {
  nombre: string;
  descripcion?: string;
  tipo?: string;
  socioId?: string;
  comidas: ComidaInput[];
}): Promise<DietaCompleta> {
  const res = await fetch('/api/dietas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear dieta');
  }
  return res.json();
}

async function updateDieta(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    socioId?: string;
    comidas: ComidaInput[];
  }
): Promise<DietaCompleta> {
  const res = await fetch(`/api/dietas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar dieta');
  return res.json();
}

async function deleteDieta(id: string): Promise<void> {
  const res = await fetch(`/api/dietas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar dieta');
}

async function asignarDieta(data: {
  dietaId: string;
  socioId: string;
}): Promise<AsignacionDieta & { dieta: DietaCompleta; socio: { id: string; nombre: string; apellido: string } }> {
  const res = await fetch('/api/asignaciones/dieta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al asignar dieta');
  return res.json();
}

async function fetchAsignaciones(socioId?: string): Promise<(AsignacionDieta & { dieta: DietaCompleta; socio: { id: string; nombre: string; apellido: string } })[]> {
  const url = socioId ? `/api/asignaciones/dieta?socioId=${socioId}` : '/api/asignaciones/dieta';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener asignaciones');
  return res.json();
}

export function useDietas(tipo?: string) {
  return useQuery({
    queryKey: ['dietas', tipo],
    queryFn: () => fetchDietas(tipo),
  });
}

export function useDieta(id: string | null) {
  return useQuery({
    queryKey: ['dieta', id],
    queryFn: () => fetchDietaById(id!),
    enabled: !!id,
  });
}

export function useCreateDieta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDieta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietas'] });
    },
  });
}

export function useUpdateDieta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDieta>[1] }) =>
      updateDieta(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dietas'] });
      queryClient.invalidateQueries({ queryKey: ['dieta', id] });
    },
  });
}

export function useDeleteDieta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDieta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietas'] });
    },
  });
}

export function useAsignarDieta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: asignarDieta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietas'] });
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
    },
  });
}

export function useAsignacionesDieta(socioId?: string) {
  return useQuery({
    queryKey: ['asignaciones', 'dieta', socioId],
    queryFn: () => fetchAsignaciones(socioId),
  });
}