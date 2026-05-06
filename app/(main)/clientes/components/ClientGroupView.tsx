"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Dumbbell,
  Activity,
  Crown,
} from "lucide-react";
import { SocioConEstado, GroupByOption } from "../types/client";
import { GroupFilterTabs } from "./GroupFilterTabs";
import { SmartSearchBar } from "./SmartSearchBar";
import { GroupSummaryCard } from "./GroupSummaryCard";
import { ClientCompactRow } from "./ClientCompactRow";
import { ClientPagination } from "./ClientPagination";
import { useGroupedClients } from "../hooks/useGroupedClients";

interface ClientGroupViewProps {
  socios: SocioConEstado[];
  onViewClient: (socio: SocioConEstado) => void;
  onEditClient: (socio: SocioConEstado) => void;
  onRenewClient: (socio: SocioConEstado) => void;
  onNotifyClient: (socio: SocioConEstado) => void;
}

export function ClientGroupView({
  socios,
  onViewClient,
  onEditClient,
  onRenewClient,
  onNotifyClient,
}: ClientGroupViewProps) {
  const [groupBy, setGroupBy] = useState<GroupByOption>("plan");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const { getGroupedItems, totalClients, pageSize } = useGroupedClients(
    socios,
    groupBy,
    searchQuery
  );

  const counts = {
    plan: Object.keys(socios.reduce((acc, s) => ({ ...acc, [s.planId]: true }), {})).length,
    horario: 3,
    grupoMuscular: Object.keys(socios.reduce((acc, s) => ({ ...acc, [s.grupoMuscular || "sin_asignar"]: true }), {})).length,
    estado: 3,
  };

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleClient = useCallback((id: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getGroupIcon = (groupBy: GroupByOption, key: string) => {
    switch (groupBy) {
      case "plan":
        return key.includes("Anual") ? (
          <Crown className="w-5 h-5 text-amber-400" />
        ) : (
          <Sparkles className="w-5 h-5 text-violet-400" />
        );
      case "horario":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "grupoMuscular":
        return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case "estado":
        return <Activity className="w-5 h-5 text-violet-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="w-full">
        <SmartSearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Filter Section */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <GroupFilterTabs activeTab={groupBy} onTabChange={setGroupBy} counts={counts} />
      </div>

      {/* Results */}
      {totalClients === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No hay clientes{searchQuery ? " que coincidan con la búsqueda" : ""}</h3>
          <p className="text-[var(--text-secondary)]">
            {searchQuery ? "Intenta con otro término de búsqueda" : "Agrega tu primer cliente al sistema"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={groupBy}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {getGroupedItems.map((group) => (
                  <GroupSummaryCard
                    key={group.key}
                    title={group.label}
                    subtitle={group.subtitle}
                    icon={getGroupIcon(groupBy, group.key)}
                    count={group.items.length}
                    isExpanded={expandedGroups.has(group.key)}
                    onToggleExpand={() => toggleGroup(group.key)}
                  >
                    <AnimatePresence>
                      {expandedGroups.has(group.key) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1"
                        >
                          {group.items.map((socio) => (
                            <ClientCompactRow
                              key={socio.id}
                              socio={socio}
                              isExpanded={expandedClients.has(socio.id)}
                              onToggleExpand={() => toggleClient(socio.id)}
                              onView={() => onViewClient(socio)}
                              onEdit={() => onEditClient(socio)}
                              onRenew={() => onRenewClient(socio)}
                              onNotify={() => onNotifyClient(socio)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GroupSummaryCard>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalClients > pageSize && (
            <ClientPagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalClients / pageSize)}
              totalItems={totalClients}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
