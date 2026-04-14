import type { ICV } from '../../../types';
import { calculateCVCompleteness } from '../../../utils/cvCompletion';

const CVCompleteness = ({ cv }: { cv: ICV }) => {
  const { score } = calculateCVCompleteness(cv);

  const getColor = (s: number) => {
    if (s >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Mükemmel' };
    if (s >= 60) return { bar: 'bg-[#6366F1]', text: 'text-[#6366F1]', label: 'İyi' };
    if (s >= 40) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'Orta' };
    return { bar: 'bg-red-500', text: 'text-red-500', label: 'Eksik' };
  };

  const color = getColor(score);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-gray-900">CV Doluluk Oranı</span>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium ${color.text}`}>{color.label}</span>
          <span className={`text-[20px] font-bold ${color.text}`}>{score}%</span>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default CVCompleteness;
