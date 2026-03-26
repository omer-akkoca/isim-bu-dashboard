import type { GenderType, JobSearchStatusType, MilitaryStatusType } from '../types';

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

export const MILITARY_MAP: Record<MilitaryStatusType, { label: string; className: string }> = {
  completed: { label: 'Yapıldı', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  exempt: { label: 'Muaf', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  deferred: { label: 'Tecilli', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  notDone: { label: 'Yapılmadı', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

export const formatSalary = (amount: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
