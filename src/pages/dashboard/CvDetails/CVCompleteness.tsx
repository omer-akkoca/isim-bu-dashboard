import type { ICV } from '../../../types';
import { calculateCVCompleteness } from '../../../utils/cvCompletion';

const CVCompleteness = ({ cv }: { cv: ICV }) => {
  const { score } = calculateCVCompleteness(cv);

  const getColor = (s: number) => {
    if (s >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Mükemmel' };
    if (s >= 60) return { bar: 'bg-[#6366F1]', text: 'text-[#818CF8]', label: 'İyi' };
    if (s >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Orta' };
    return { bar: 'bg-red-500', text: 'text-red-400', label: 'Eksik' };
  };

  const color = getColor(score);

  return (
    <div className="bg-[#1C1E27] border border-white/6 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-white">CV Doluluk Oranı</span>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium ${color.text}`}>{color.label}</span>
          <span className={`text-[20px] font-bold ${color.text}`}>{score}%</span>
        </div>
      </div>
      <div className="w-full h-2 bg-white/6 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default CVCompleteness;
