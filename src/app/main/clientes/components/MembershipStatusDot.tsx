'use client';

import { MembershipStatus } from '../types/client';

interface MembershipStatusDotProps {
  status: MembershipStatus;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<MembershipStatus, string> = {
  vigente: '#2ECC8F',
  porVencer: '#F59E0B',
  vencida: '#E8514A',
};

const STATUS_LABELS: Record<MembershipStatus, string> = {
  vigente: 'Vigente',
  porVencer: 'Por vencer',
  vencida: 'Vencida',
};

export function MembershipStatusDot({ status, size = 'md' }: MembershipStatusDotProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div
      className={`${dotSize} rounded-full shrink-0`}
      style={{ backgroundColor: STATUS_COLORS[status] }}
      title={STATUS_LABELS[status]}
    />
  );
}

export function getMembershipStatus(venceEn?: number): MembershipStatus {
  if (venceEn === undefined) return 'vigente';
  if (venceEn < 0) return 'vencida';
  if (venceEn <= 7) return 'porVencer';
  return 'vigente';
}
