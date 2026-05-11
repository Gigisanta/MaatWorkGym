import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Socio, Pago, Fichaje, Plan } from '@prisma/client';

type SocioConEstado = Socio & {
  plan: Plan;
  pagos: Pago[];
  fichajes: Fichaje[];
  tieneDeuda: boolean;
  venceEn?: number;
  visitasMesActual?: number;
};

async function fetchSocios(search?: string): Promise<SocioConEstado[]> {
  const url = search ? `/api/socios?search=${encodeURIComponent(search)}` : '/api/socios';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener socios');
  return res.json();
}

async function fetchSocioByDni(dni: string): Promise<SocioConEstado> {
  const res = await fetch(`/api/socios/dni/${dni}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Socio no encontrado');
    throw new Error('Error al obtener socio');
  }
  return res.json();
}

async function fetchSocioById(id: string): Promise<SocioConEstado> {
  const res = await fetch(`/api/socios/${id}`);
  if (!res.ok) throw new Error('Error al obtener socio');
  return res.json();
}

async function createSocio(data: {
  dni: string;
  nombre: string;
  apellido: string;
  planId: string;
  fechaInicio: string;
  fotoUrl?: string;
  telefono?: string;
  horarioEntrenamiento?: string;
  grupoMuscular?: string;
  objetivoCliente?: string;
}): Promise<Socio> {
  const res = await fetch('/api/socios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear socio');
  }
  return res.json();
}

async function updateSocio(
  id: string,
  data: {
    nombre?: string;
    apellido?: string;
    planId?: string;
    fotoUrl?: string;
    telefono?: string | null;
    fechaNacimiento?: string | null;
    horarioEntrenamiento?: string;
    grupoMuscular?: string;
    objetivoCliente?: string;
  },
): Promise<Socio> {
  const res = await fetch(`/api/socios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar socio');
  return res.json();
}

async function deleteSocio(id: string): Promise<void> {
  const res = await fetch(`/api/socios/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar socio');
}

export function useSocios(search?: string) {
  return useQuery({
    queryKey: ['socios', search],
    queryFn: () => fetchSocios(search),
  });
}

export function useSocioByDni(dni: string | null) {
  return useQuery({
    queryKey: ['socio', 'dni', dni],
    queryFn: () => fetchSocioByDni(dni!),
    enabled: !!dni,
    retry: false,
  });
}

export function useSocioById(id: string | null) {
  return useQuery({
    queryKey: ['socio', id],
    queryFn: () => fetchSocioById(id!),
    enabled: !!id,
  });
}

export function useCreateSocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSocio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
}

export function useUpdateSocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSocio>[1] }) =>
      updateSocio(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['socio', id] });
    },
  });
}

export function useDeleteSocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSocio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
}
