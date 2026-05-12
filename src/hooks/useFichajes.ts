import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

type Fichaje = {
  id: string;
  socioId: string | null;
  empleadoId: string | null;
  fechaHora: Date;
  tipo: string;
  notas: string | null;
  createdAt: Date;
};

type FichajeConSocio = Fichaje & {
  socio: Socio & { plan: Plan };
};

async function fetchFichajes(hoy: boolean = false): Promise<FichajeConSocio[]> {
  const url = hoy ? '/api/fichajes?hoy=true' : '/api/fichajes';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener fichajes');
  return res.json();
}

async function createFichaje(socioId: string): Promise<FichajeConSocio> {
  const res = await fetch('/api/fichajes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ socioId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al registrar fichaje');
  }
  return res.json();
}

export function useFichajes(hoy: boolean = false) {
  return useQuery({
    queryKey: ['fichajes', hoy],
    queryFn: () => fetchFichajes(hoy),
    refetchInterval: 30000,
  });
}

export function useCreateFichaje() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFichaje,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fichajes'] });
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['socio'] });
    },
  });
}
