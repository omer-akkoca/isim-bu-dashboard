import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import type { IUser } from '../../types';
import { useUserActions } from '../../actions';

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState('');

  const { loading, totalPages, getUsers } = useUserActions();

  const boot = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    boot();
  }, []);

  const filtered = users.filter(
    u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.surname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.title?.toLowerCase().includes(search.toLowerCase()),
  );

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

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5F7A] pointer-events-none" />
        <input
          className="w-full max-w-sm bg-[#1C1E27] border border-white/6 rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-white placeholder-[#5A5F7A] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
          placeholder="İsim, e-posta veya ünvan ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-[#5A5F7A] text-[14px]">
          <Users size={40} className="opacity-30" />
          <p>{search ? 'Sonuç bulunamadı.' : 'Henüz kullanıcı yok.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filtered.map(user => (
            <div
              key={user.uid}
              className="bg-[#1C1E27] border border-white/6 rounded-2xl p-5 hover:border-[#6366F1]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[16px] font-bold text-white shrink-0 overflow-hidden">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user.name || user.email || '?')[0].toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-white">{user.name + ' ' + user.surname || '—'}</div>
                  {user.title && <div className="text-[12px] text-[#818CF8] mt-0.5">{user.title}</div>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {user.email && (
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3C7]">
                    <Mail size={12} className="text-[#5A5F7A] shrink-0" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3C7]">
                    <Phone size={12} className="text-[#5A5F7A] shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3C7]">
                    <MapPin size={12} className="text-[#5A5F7A] shrink-0" />
                    <span>
                      {user.location.city}, {user.location.district}
                    </span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3C7]">
                    <Calendar size={12} className="text-[#5A5F7A] shrink-0" />
                    <span>{new Date(user.createdAt?.seconds * 1000).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
