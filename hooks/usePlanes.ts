import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Plan } from "@prisma/client";

async function fetchPlanes(): Promise<Plan[]> {
  const res = await fetch("/api/planes");
  if (!res.ok) throw new Error("Error al obtener planes");
  return res.json();
}

async function fetchPlanById(id: string): Promise<Plan & { _count?: { socios: number } }> {
  const res = await fetch(`/api/planes/${id}`);
  if (!res.ok) throw new Error("Error al obtener plan");
  return res.json();
}

async function createPlan(data: {
  nombre: string;
  duracionDias: number;
  precio: number;
}): Promise<Plan> {
  const res = await fetch("/api/planes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al crear plan");
  }
  return res.json();
}

async function updatePlan(
  id: string,
  data: { nombre?: string; duracionDias?: number; precio?: number }
): Promise<Plan> {
  const res = await fetch(`/api/planes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al actualizar plan");
  }
  return res.json();
}

async function deletePlan(id: string): Promise<void> {
  const res = await fetch(`/api/planes/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al eliminar plan");
  }
}

export function usePlanes() {
  return useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
  });
}

export function usePlanById(id: string | null) {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => fetchPlanById(id!),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePlan>[1] }) =>
      updatePlan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
    },
  });
}
