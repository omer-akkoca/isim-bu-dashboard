import type React from 'react';

import { useNavigate } from 'react-router-dom';

import { GENDER_MAP, JOB_STATUS_MAP } from '../../../constants/typeMaps';
import type { IUser } from '../../../types';

const UserRowItem: React.FC<{ user: IUser; isLast: boolean }> = ({ user, isLast = false }) => {
  const navigate = useNavigate();

  const status = JOB_STATUS_MAP[user.jobSearchStatus];
  const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();

  return (
    <tr key={user.uid} className={`hover:bg-gray-50 transition-colors ${isLast ? 'border-b border-gray-100' : ''}`}>
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

      <td className="px-5 py-3.5 text-[13px] text-gray-500">{user.title ?? <span className="text-gray-300">—</span>}</td>

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
};

export default UserRowItem;
