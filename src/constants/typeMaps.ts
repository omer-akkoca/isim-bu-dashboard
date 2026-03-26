import type {
  CommonLanguagesType,
  DegreeType,
  EmploymentType,
  GenderType,
  JobSearchStatusType,
  MilitaryStatusType,
  ProficiencyType,
  WorkType,
} from '../types';

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

export const EMPLOYMENT_MAP: Record<EmploymentType, string> = {
  full_time: 'Tam Zamanlı',
  part_time: 'Yarı Zamanlı',
  internship: 'Staj',
  freelance: 'Freelance',
  volunteer: 'Gönüllü',
  contract: 'Sözleşmeli',
};

export const WORK_TYPE_MAP: Record<WorkType, { label: string; className: string }> = {
  remote: { label: 'Uzaktan', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  hybrid: { label: 'Hibrit', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  onsite: { label: 'Ofiste', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

export const DEGREE_MAP: Record<DegreeType, string> = {
  high_school: 'Lise',
  associate: 'Ön Lisans',
  bachelor: 'Lisans',
  master: 'Yüksek Lisans',
  phd: 'Doktora',
  vocational: 'Meslek Yüksekokulu',
  other: 'Diğer',
};

export const PROFICIENCY_MAP: Record<ProficiencyType, { label: string; level: number }> = {
  a1: { label: 'A1 – Başlangıç', level: 1 },
  a2: { label: 'A2 – Temel', level: 2 },
  b1: { label: 'B1 – Orta Altı', level: 3 },
  b2: { label: 'B2 – Orta', level: 4 },
  c1: { label: 'C1 – İleri', level: 5 },
  c2: { label: 'C2 – Üst', level: 6 },
  native: { label: 'Ana Dil', level: 7 },
};

export const LANGUAGE_MAP: Record<CommonLanguagesType, string> = {
  english: 'İngilizce',
  german: 'Almanca',
  french: 'Fransızca',
  spanish: 'İspanyolca',
  russian: 'Rusça',
  arabic: 'Arapça',
  chinese: 'Çince',
  japanese: 'Japonca',
  portuguese: 'Portekizce',
  hindi: 'Hintçe',
  other: 'Diğer',
};
