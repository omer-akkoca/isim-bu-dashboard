import React, { useEffect, useState } from 'react';

import { FileText, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuthActions } from '../../actions';
import { useAuth } from '../../hooks';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/users', label: 'Kullanıcılar', icon: Users, end: false },
  { to: '/dashboard/cvs', label: "CV'ler", icon: FileText, end: false },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 bg-white border-r border-gray-200 flex-col px-4 py-6">
        <SidebarContent setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col px-4 py-6 transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <Menu size={24} />
          </button>
          <button className="flex flex-row items-center gap-2" onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="İşim Bu" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">İşim Bu</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{ setSidebarOpen: (x: boolean) => void }> = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  const { user } = useAuth();

  const handleLogout = async () => {
    await logout({ data: null });
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="İşim Bu" className="w-12 h-12 rounded-[9px] object-cover" />
            <div>
              <div className="text-[14px] font-bold text-gray-900 tracking-tight">İşim Bu</div>
              <div className="text-[10px] text-gray-400 mt-0.5">İşveren Paneli</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-gray-200 mb-4" />

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-2.5 mb-1.5">Menü</span>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
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
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] text-gray-600 truncate">{user?.email}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">İşveren</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
        >
          <LogOut size={15} />
          <span>Çıkış</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;
