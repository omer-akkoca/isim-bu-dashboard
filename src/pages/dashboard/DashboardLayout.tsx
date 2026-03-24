import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, FileText, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthActions } from '../../actions/authActions';
import { useEffect } from 'react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout({ data: null, onSuccess: () => navigate('/login') });
  };

  useEffect(() => {
    document.title = 'İşim Bu — İşveren Paneli';
    return () => {
      document.title = 'İşim Bu';
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#111318] border-r border-white/6 flex flex-col px-4 py-6">
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <img src="/logo.png" alt="Benim İşim" className="w-9 h-9 rounded-[9px] object-cover" />
            <div>
              <div className="text-[14px] font-bold text-white tracking-tight">İşim Bu</div>
              <div className="text-[10px] text-[#5A5F7A] mt-0.5">İşveren Paneli</div>
            </div>
          </div>

          <div className="h-px bg-white/6 mb-4" />

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-widest text-[#5A5F7A] uppercase px-2.5 mb-1.5">Menü</span>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white'
                }`
              }
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white'
                }`
              }
            >
              <Users size={17} />
              <span>Kullanıcılar</span>
            </NavLink>
            <NavLink
              to="/dashboard/cvs"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white'
                }`
              }
            >
              <FileText size={17} />
              <span>CV'ler</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 bg-[#1C1E27] border border-white/6 rounded-lg px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] text-[#9CA3C7] truncate">{user?.email}</div>
              <div className="text-[10px] text-[#5A5F7A] mt-0.5">İşveren</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 border border-white/6 rounded-lg text-[13px] font-medium text-[#5A5F7A] hover:bg-red-500/8 hover:border-red-500/25 hover:text-red-300 transition-all"
          >
            <LogOut size={15} />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#0B0C10]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
