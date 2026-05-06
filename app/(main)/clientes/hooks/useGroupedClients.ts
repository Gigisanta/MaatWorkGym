"use client";

import { useMemo } from "react";
import {
  SocioConEstado,
  GroupByOption,
  HorarioType,
  GRUPO_MUSCULAR_LABELS,
  HORARIO_LABELS,
  GroupedData,
} from "../types/client";
import { getMembershipStatus } from "../components/MembershipStatusDot";

const PAGE_SIZE = 20;

export function useGroupedClients(
  socios: SocioConEstado[] | undefined,
  groupBy: GroupByOption,
  searchQuery: string
) {
  const filteredSocios = useMemo(() => {
    if (!socios) return [];
    if (!searchQuery.trim()) return socios;

    const query = searchQuery.toLowerCase();
    return socios.filter(
      (socio) =>
        socio.nombre.toLowerCase().includes(query) ||
        socio.apellido.toLowerCase().includes(query) ||
        socio.dni.toLowerCase().includes(query) ||
        socio.plan.nombre.toLowerCase().includes(query)
    );
  }, [socios, searchQuery]);

  const sortedSocios = useMemo(() => {
    return [...filteredSocios].sort((a, b) => {
      const apellidoCompare = a.apellido.localeCompare(b.apellido);
      if (apellidoCompare !== 0) return apellidoCompare;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [filteredSocios]);

  const groupedData = useMemo((): GroupedData => {
    const grouped: GroupedData = {
      plan: {},
      horario: { matutino: [], vespertino: [], nocturno: [] },
      grupoMuscular: {},
      estado: { vigentes: [], porVencer: [], vencidas: [] },
    };

    sortedSocios.forEach((socio) => {
      if (!grouped.plan[socio.planId]) {
        grouped.plan[socio.planId] = [];
      }
      grouped.plan[socio.planId].push(socio);

      const horario = (socio.horarioEntrenamiento as HorarioType) || "matutino";
      grouped.horario[horario].push(socio);

      const grupo = socio.grupoMuscular || "sin_asignar";
      if (!grouped.grupoMuscular[grupo]) {
        grouped.grupoMuscular[grupo] = [];
      }
      grouped.grupoMuscular[grupo].push(socio);

      const status = getMembershipStatus(socio.venceEn);
      grouped.estado[status === "vigente" ? "vigentes" : status === "porVencer" ? "porVencer" : "vencidas"].push(socio);
    });

    return grouped;
  }, [sortedSocios]);

  const getGroupedItems = useMemo(() => {
    switch (groupBy) {
      case "plan":
        return Object.entries(groupedData.plan).map(([planId, items]) => ({
          key: planId,
          label: items[0]?.plan.nombre || "Sin plan",
          subtitle: `$${items[0]?.plan.precio}/mes`,
          items,
        }));
      case "horario":
        return Object.entries(groupedData.horario).map(([horario, items]) => ({
          key: horario,
          label: HORARIO_LABELS[horario as HorarioType] || horario,
          subtitle: undefined,
          items,
        }));
      case "grupoMuscular":
        return Object.entries(groupedData.grupoMuscular).map(([grupo, items]) => ({
          key: grupo,
          label: grupo === "sin_asignar" ? "Sin asignar" : (GRUPO_MUSCULAR_LABELS[grupo as keyof typeof GRUPO_MUSCULAR_LABELS] || grupo),
          subtitle: undefined,
          items,
        }));
      case "estado":
        return [
          { key: "vigentes", label: "Vigentes", subtitle: "Más de 7 días", items: groupedData.estado.vigentes },
          { key: "porVencer", label: "Por vencer", subtitle: "7 días o menos", items: groupedData.estado.porVencer },
          { key: "vencidas", label: "Vencidas", subtitle: "Membresía vencida", items: groupedData.estado.vencidas },
        ];
      default:
        return [];
    }
  }, [groupBy, groupedData]);

  const totalGroups = getGroupedItems.length;
  const totalClients = sortedSocios.length;
  const totalPages = Math.ceil(totalClients / PAGE_SIZE);

  return {
    groupedData,
    getGroupedItems,
    totalGroups,
    totalClients,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}