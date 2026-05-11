import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Fichaje, Empleado } from '@prisma/client';

type FichajeConEmpleado = Fichaje & {
  empleado: Empleado;
};

type EmpleadoConFichajes = Empleado & {
  fichajes: Fichaje[];
};

async function fetchEmpleados(): Promise<Empleado[]> {
  const res = await fetch('/api/empleados');
  if (!res.ok) throw new Error('Error al obtener empleados');
  return res.json();
}

async function fetchEmpleadoByDni(dni: string): Promise<EmpleadoConFichajes | null> {
  if (!dni || dni.length < 6) return null;
  const res = await fetch(`/api/empleados/dni/${encodeURIComponent(dni)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Error al obtener empleado');
  }
  return res.json();
}

async function fetchFichajes(options?: {
  hoy?: boolean;
  empleadoId?: string;
  desde?: string;
  hasta?: string;
}): Promise<FichajeConEmpleado[]> {
  const params = new URLSearchParams();
  if (options?.hoy) params.set('hoy', 'true');
  if (options?.empleadoId) params.set('empleadoId', options.empleadoId);
  if (options?.desde) params.set('desde', options.desde);
  if (options?.hasta) params.set('hasta', options.hasta);

  const url = `/api/empleados/fichajes${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener fichajes');
  return res.json();
}

async function createFichaje(data: {
  empleadoId: string;
  tipo?: 'entrada' | 'salida' | 'pausa_inicio' | 'pausa_fin';
  notas?: string;
}): Promise<FichajeConEmpleado> {
  const res = await fetch('/api/empleados/fichar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al registrar fichaje');
  }
  return res.json();
}

async function createEmpleado(data: {
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  cargo?: string;
  fechaInicio?: string;
  horarioEntrada?: string;
  horarioSalida?: string;
}): Promise<Empleado> {
  const res = await fetch('/api/empleados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear empleado');
  }
  return res.json();
}

export function useEmpleados() {
  return useQuery({
    queryKey: ['empleados'],
    queryFn: fetchEmpleados,
  });
}

export function useEmpleadoByDni(dni: string) {
  return useQuery({
    queryKey: ['empleado', 'dni', dni],
    queryFn: () => fetchEmpleadoByDni(dni),
    enabled: dni.length >= 6,
  });
}

export function useEmpleadoFichajes(options?: {
  hoy?: boolean;
  empleadoId?: string;
  desde?: string;
  hasta?: string;
}) {
  return useQuery({
    queryKey: ['empleado-fichajes', options],
    queryFn: () => fetchFichajes(options),
    refetchInterval: 30000,
  });
}

export function useCreateFichaje() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFichaje,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleado-fichajes'] });
      queryClient.invalidateQueries({ queryKey: ['empleado'] });
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
    },
  });
}

export function useCreateEmpleado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
    },
  });
}
