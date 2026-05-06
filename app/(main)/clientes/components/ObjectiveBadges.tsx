"use client";

import { Target } from "lucide-react";

interface ObjectiveBadgesProps {
  objetivo?: string | null;
}

export function ObjectiveBadges({ objetivo }: ObjectiveBadgesProps) {
  if (!objetivo) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
      <Target className="w-3 h-3" />
      <span className="truncate max-w-[150px]">{objetivo}</span>
    </div>
  );
}