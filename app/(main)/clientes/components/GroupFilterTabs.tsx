"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Clock, Dumbbell, Activity, Filter } from "lucide-react";
import { GroupByOption } from "../types/client";

interface GroupFilterTabsProps {
  activeTab: GroupByOption;
  onTabChange: (tab: GroupByOption) => void;
  counts: {
    plan: number;
    horario: number;
    grupoMuscular: number;
    estado: number;
  };
}

const TABS: { id: GroupByOption; label: string; icon: React.ReactNode }[] = [
  { id: "plan", label: "Por Plan", icon: <LayoutGrid className="w-5 h-5" /> },
  { id: "horario", label: "Por Horario", icon: <Clock className="w-5 h-5" /> },
  { id: "grupoMuscular", label: "Grupo Muscular", icon: <Dumbbell className="w-5 h-5" /> },
  { id: "estado", label: "Por Estado", icon: <Activity className="w-5 h-5" /> },
];

export function GroupFilterTabs({ activeTab, onTabChange, counts }: GroupFilterTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Filter className="w-4 h-4" />
        <span>Agrupar por:</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-violet-500/20"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? "bg-violet-500/30 text-violet-300"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-violet-500/10 rounded-xl -z-10"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
