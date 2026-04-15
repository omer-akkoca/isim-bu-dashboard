export const getCvCompletenessColor = (s: number) => {
  if (s >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Mükemmel' };
  if (s >= 60) return { bar: 'bg-[#6366F1]', text: 'text-[#6366F1]', label: 'İyi' };
  if (s >= 40) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'Orta' };
  return { bar: 'bg-red-500', text: 'text-red-500', label: 'Eksik' };
};
