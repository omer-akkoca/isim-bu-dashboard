import { useEffect, useState } from 'react';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { FileText, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { useAuth } from '../../hooks';
import { useAuthActions } from '../../actions';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/users', label: 'Kullanıcılar', icon: Users, end: false },
  { to: '/dashboard/cvs', label: "CV'ler", icon: FileText, end: false },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();

  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route değişince mobilde sidebar kapansın
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout({ data: null });
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="İşim Bu" className="w-12 h-12 rounded-[9px] object-cover" />
            <div>
              <div className="text-[14px] font-bold text-white tracking-tight">İşim Bu</div>
              <div className="text-[10px] text-[#5A5F7A] mt-0.5">İşveren Paneli</div>
            </div>
          </div>
          {/* Mobilde kapat butonu */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#5A5F7A] hover:text-white hover:bg-white/6 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-white/6 mb-4" />

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-widest text-[#5A5F7A] uppercase px-2.5 mb-1.5">Menü</span>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'text-[#9CA3C7] hover:bg-[#1C1E27] hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5 bg-[#1C1E27] border border-white/6 rounded-lg px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-[13px] font-bold text-white shrink-0">
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
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-80 shrink-0 bg-[#111318] border-r border-white/6 flex-col px-4 py-6">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#111318] border-r border-white/6 flex flex-col px-4 py-6 transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-[#111318] border-b border-white/6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#9CA3C7] hover:text-white hover:bg-white/6 transition-all"
          >
            <Menu size={24} />
          </button>
          <button className="flex flex-row items-center gap-2" onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="İşim Bu" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-[14px] font-bold text-white tracking-tight">İşim Bu</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0B0C10]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
