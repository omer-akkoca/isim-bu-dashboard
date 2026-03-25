import type React from 'react';
import type { ICV, UserBasicInfo } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useDayJs } from '../../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { useUserActions } from '../../../actions';

type CvRowItemProps = { cv: ICV };

const CvRowItem: React.FC<CvRowItemProps> = ({ cv }) => {
  const { dayjs } = useDayJs();
  const navigate = useNavigate();
  const { getUserBasicInfo } = useUserActions();

  const [user, setUser] = useState<UserBasicInfo>();

  const initials = useMemo(() => {
    if (!user) return '-';
    return `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();
  }, [user]);

  useEffect(() => {
    const boot = async () => {
      const bootedData = await getUserBasicInfo(cv.userId);
      setUser(bootedData ?? undefined);
    };
    if (cv) {
      boot();
    }
  }, [cv]);

  return (
    <tr className={`hover:bg-white/2 transition-colors border-b border-white/4`}>
      {/* Kullanıcı */}
      <td className="px-5 py-3.5">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[12px] font-bold text-white shrink-0 overflow-hidden">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <div className="text-[13px] font-medium text-white">
                {user.name} {user.surname}
              </div>
              {user.title && <div className="text-[11px] text-[#5A5F7A] mt-0.5">{user.title}</div>}
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-[#9CA3C7]">Bulunamadı</span>
        )}
      </td>
      {/* CV Başlığı */}
      <td className="px-5 py-3.5">
        <div className="text-[13px] font-medium text-white">{cv.title}</div>
      </td>

      {/* Güncelleme */}
      <td className="px-5 py-3.5 text-[13px] text-[#9CA3C7]">
        {dayjs({ date: cv.updatedAt.toDate(), format: 'DD MMM YYYY' })}
      </td>

      {/* Detay */}
      <td className="px-5 py-3.5">
        <button
          onClick={() => navigate(`/dashboard/cv/${cv.cvId}`)}
          className="text-[#6366F1] hover:text-[#818CF8] text-[12px] font-medium"
        >
          Görüntüle →
        </button>
      </td>
    </tr>
  );
};

export default CvRowItem;
