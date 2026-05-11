'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Clock, Dumbbell, Activity } from 'lucide-react';
import { GroupByOption } from '../types/client';
import { cn } from '@/lib/utils';

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

const TABS: { id: GroupByOption; label: string; icon: any }[] = [
  { id: 'plan', label: 'Plan', icon: LayoutGrid },
  { id: 'horario', label: 'Horario', icon: Clock },
  { id: 'grupoMuscular', label: 'Músculo', icon: Dumbbell },
  { id: 'estado', label: 'Estado', icon: Activity },
];

export function GroupFilterTabs({ activeTab, onTabChange, counts }: GroupFilterTabsProps) {
  return (
    <div className="flex items-center gap-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            {count > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-medium",
                isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
