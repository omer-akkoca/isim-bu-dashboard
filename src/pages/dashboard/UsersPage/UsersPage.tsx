import { useEffect, useState } from 'react';

import { Users } from 'lucide-react';

import { useUserActions } from '../../../actions';
import type { IUser } from '../../../types';

import UserRowItem from './UserRowItem';

const UsersPage = () => {
  const { loading, handleGetUserCount, handleGetAllUsers } = useUserActions();

  const [userCount, setUserCount] = useState<number>(0);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const boot = async () => {
      const data = await handleGetAllUsers();
      setUsers(data);
    };
    boot();
  }, []);

  useEffect(() => {
    const boot = async () => {
      const cvCount = await handleGetUserCount();
      setUserCount(cvCount);
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
          <span>Toplam {userCount} kullanıcı</span>
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
              {users.map((user, idx) => (
                <UserRowItem key={user.uid} user={user} isLast={idx !== users.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { UsersPage };
