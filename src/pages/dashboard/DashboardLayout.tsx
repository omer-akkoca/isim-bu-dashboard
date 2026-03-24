import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FileText, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <div className="dash-logo-wrap">
            <img src="/logo.png" alt="Benim İşim" className="dash-logo" />
            <div>
              <div className="dash-brand">Benim İşim</div>
              <div className="dash-brand-sub">İşveren Paneli</div>
            </div>
          </div>

          <div className="dash-divider" />

          <nav className="dash-nav">
            <div className="dash-nav-label">Menü</div>
            <NavLink to="/dashboard/users" className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Kullanıcılar</span>
            </NavLink>
            <NavLink to="/dashboard/cvs" className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>CV'ler</span>
            </NavLink>
          </nav>
        </div>

        <div className="dash-sidebar-bottom">
          <div className="dash-user-card">
            <div className="dash-user-avatar">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="dash-user-info">
              <div className="dash-user-email">{user?.email}</div>
              <div className="dash-user-role">İşveren</div>
            </div>
          </div>
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
