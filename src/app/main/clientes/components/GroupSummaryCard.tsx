'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupSummaryCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  count: number;
  badge?: ReactNode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  children: ReactNode;
}

export function GroupSummaryCard({
  title,
  subtitle,
  icon,
  count,
  badge,
  isExpanded,
  onToggleExpand,
  children,
}: GroupSummaryCardProps) {
  return (
    <div className={cn(
      "rounded-xl bg-card border transition-all duration-200",
      isExpanded ? "border-primary/20 shadow-md" : "border-border hover:border-primary/10"
    )}>
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-all"
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
          isExpanded ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
        )}>
          {icon}
        </div>

        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {badge}
          <div className="text-right">
            <span className="text-lg font-semibold text-foreground">{count}</span>
            <p className="text-xs text-muted-foreground">{count === 1 ? 'socio' : 'socios'}</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="p-1.5 rounded-md bg-muted text-muted-foreground"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
