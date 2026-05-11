import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Pago } from '@prisma/client';

async function fetchPagos(socioId?: string): Promise<Pago[]> {
  const url = socioId ? `/api/pagos?socioId=${socioId}` : '/api/pagos';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener pagos');
  return res.json();
}

async function createPago(data: {
  socioId: string;
  monto: number;
  metodo: 'efectivo' | 'transferencia';
  mes: number;
  anio: number;
}): Promise<Pago> {
  const res = await fetch('/api/pagos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al registrar pago');
  }
  return res.json();
}

async function deletePago(id: string): Promise<void> {
  const res = await fetch(`/api/pagos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al eliminar pago');
  }
}

export function usePagos(socioId?: string) {
  return useQuery({
    queryKey: ['pagos', socioId],
    queryFn: () => fetchPagos(socioId),
  });
}

export function useCreatePago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPago,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pagos', variables.socioId] });
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['socio'] });
    },
  });
}

export function useDeletePago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['socio'] });
    },
  });
}
