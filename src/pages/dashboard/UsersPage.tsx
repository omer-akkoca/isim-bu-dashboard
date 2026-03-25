import { useEffect, useState } from 'react';
import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import type { IUser } from '../../types';
import { useUserActions } from '../../actions';
import { GENDER_MAP, JOB_STATUS_MAP } from '../../constants/typeMaps';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();

  const [currentPage] = useState(1);

  const [users, setUsers] = useState<IUser[]>([]);

  const { loading, totalPages, getUsers } = useUserActions();

  const boot = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    boot();
  }, []);

  return (
    <div className="p-10 mx-auto animate-[fadeUp_0.3s_ease]">
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Kullanıcılar</h1>
          <p className="text-[13px] text-[#5A5F7A] mt-1">Uygulamaya kayıtlı tüm kullanıcılar</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1C1E27] border border-white/6 rounded-full px-4 py-2 text-[12px] font-medium text-[#9CA3C7]">
          <Users size={15} className="text-[#818CF8]" />
          <span>{users.length} kullanıcı</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1C1E27] border border-white/6 rounded-2xl overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider px-5 py-3.5">
                  Kullanıcı
                </th>
                <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider px-5 py-3.5">
                  Ünvan
                </th>
                <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider px-5 py-3.5">
                  Cinsiyet
                </th>
                <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider px-5 py-3.5">
                  İş Arama
                </th>
                <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider px-5 py-3.5">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => {
                  const status = JOB_STATUS_MAP[user.jobSearchStatus];
                  const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();
                  return (
                    <tr
                      key={user.uid}
                      className={`hover:bg-white/2 transition-colors ${idx !== users.length - 1 ? 'border-b border-white/4' : ''}`}
                    >
                      {/* Kullanıcı */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[12px] font-bold text-white shrink-0 overflow-hidden">
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
                            {user.email && <div className="text-[11px] text-[#5A5F7A] mt-0.5">{user.email}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Ünvan */}
                      <td className="px-5 py-3.5 text-[13px] text-[#9CA3C7]">
                        {user.title ?? <span className="text-[#5A5F7A]">—</span>}
                      </td>

                      {/* Cinsiyet */}
                      <td className="px-5 py-3.5 text-[13px] text-[#9CA3C7]">
                        {GENDER_MAP[user.gender] ?? <span className="text-[#5A5F7A]">—</span>}
                      </td>

                      {/* İş Arama */}
                      <td className="px-5 py-3.5">
                        {status && (
                          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
                            {status.label}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => navigate(`/dashboard/user/${user.uid}`)}
                          className="text-[#6366F1] hover:text-[#818CF8] text-[12px] font-medium"
                        >
                          Görüntüle →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button
            onClick={() => getUsers(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/6 text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .reduce<(number | 'dots')[]>((acc, page, idx, arr) => {
              if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('dots');
              acc.push(page);
              return acc;
            }, [])
            .map((item, idx) =>
              item === 'dots' ? (
                <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-[#5A5F7A] text-[13px]">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => getUsers(item)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === item
                      ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25'
                      : 'border border-white/6 text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ),
            )}

          <button
            onClick={() => getUsers(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/6 text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export { UsersPage };
