import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Plan } from "@prisma/client";

async function fetchPlanes(): Promise<Plan[]> {
  const res = await fetch("/api/planes");
  if (!res.ok) throw new Error("Error al obtener planes");
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
  if (!res.ok) throw new Error("Error al crear plan");
  return res.json();
}

export function usePlanes() {
  return useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
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
