import type { GenderType, JobSearchStatusType } from '../types';

export const JOB_STATUS_MAP: Record<JobSearchStatusType, { label: string; className: string }> = {
  very_urgent: { label: 'Çok Acil', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  urgent: { label: 'Acil', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  looking: { label: 'Arıyor', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  not_looking: { label: 'Pasif', className: 'bg-white/5 text-[#9CA3C7] border-white/8' },
};

export const GENDER_MAP: Record<GenderType, string> = {
  male: 'Erkek',
  female: 'Kadın',
  other: 'Diğer',
};
