import type React from 'react';

import { useNavigate } from 'react-router-dom';

import { useDayJs } from '../../../hooks';
import type { ICV } from '../../../types';
import { getCvCompletenessColor } from '../../../utils';
import { calculateCVCompleteness } from '../../../utils/cvCompletion';

type CvRowItemProps = { cv: ICV };

const CvRowItem: React.FC<CvRowItemProps> = ({ cv }) => {
  const { dayjs } = useDayJs();
  const navigate = useNavigate();

  const { score } = calculateCVCompleteness(cv);

  const color = getCvCompletenessColor(score);

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      {/* CV Başlığı */}
      <td className="px-5 py-3.5">
        <div className="text-[13px] font-medium text-gray-900 capitalize">{cv.title}</div>
      </td>

      {/* CV Tamamlama Oranı */}
      <td className="px-5 py-3.5">
        <span className={`text-[13px] font-bold ${color.text}`}>{score}%</span>
      </td>

      {/* Oluşturma */}
      <td className="px-5 py-3.5 text-[13px] text-gray-400">
        {dayjs({ date: cv.createdAt.toDate(), format: 'DD MMM YYYY' })}
      </td>

      {/* Güncelleme */}
      <td className="px-5 py-3.5 text-[13px] text-gray-400">
        {dayjs({ date: cv.updatedAt.toDate(), format: 'DD MMM YYYY' })}
      </td>

      {/* Detay */}
      <td className="px-5 py-3.5">
        <button
          onClick={() => navigate(`/dashboard/cv/${cv.cvId}`)}
          className="text-[#6366F1] hover:text-[#4F46E5] text-[12px] font-medium"
        >
          Görüntüle →
        </button>
      </td>
    </tr>
  );
};

export default CvRowItem;
