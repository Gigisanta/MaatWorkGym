"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
    <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="flex-1 text-left">
          <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {badge}
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] text-sm font-medium text-[var(--text-secondary)]">
            {count} {count === 1 ? "cliente" : "clientes"}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-[var(--border)]">
              <div className="space-y-2">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}