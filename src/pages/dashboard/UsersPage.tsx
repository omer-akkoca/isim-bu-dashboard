import { useEffect, useState } from 'react';

import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useUserActions } from '../../actions';
import { GENDER_MAP, JOB_STATUS_MAP } from '../../constants/typeMaps';
import type { IUser } from '../../types';

const UsersPage = () => {
  const navigate = useNavigate();
  const [currentPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);
  const { loading, totalPages, getUsers } = useUserActions();

  useEffect(() => {
    const boot = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    boot();
  }, []);

  return (
    <div className="p-10 mx-auto animate-[fadeUp_0.3s_ease]">
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Kullanıcılar</h1>
          <p className="text-[13px] text-gray-400 mt-1">Uygulamaya kayıtlı tüm kullanıcılar</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[12px] font-medium text-gray-500">
          <Users size={15} className="text-[#6366F1]" />
          <span>{users.length} kullanıcı</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Kullanıcı
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Ünvan
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Cinsiyet
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  İş Arama
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const status = JOB_STATUS_MAP[user.jobSearchStatus];
                const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();
                return (
                  <tr
                    key={user.uid}
                    className={`hover:bg-gray-50 transition-colors ${idx !== users.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
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
                          <div className="text-[13px] font-medium text-gray-900">
                            {user.name} {user.surname}
                          </div>
                          {user.email && <div className="text-[11px] text-gray-400 mt-0.5">{user.email}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {user.title ?? <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {GENDER_MAP[user.gender] ?? <span className="text-gray-300">—</span>}
                    </td>

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
                        className="text-[#6366F1] hover:text-[#4F46E5] text-[12px] font-medium"
                      >
                        Görüntüle →
                      </button>
                    </td>
                  </tr>
                );
              })}
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
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-[13px]">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => getUsers(item)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === item
                      ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20'
                      : 'border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  {item}
                </button>
              ),
            )}

          <button
            onClick={() => getUsers(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export { UsersPage };
