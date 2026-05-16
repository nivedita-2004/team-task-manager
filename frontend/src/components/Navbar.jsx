import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo animate-fade-in">
          <CheckCircle color="var(--primary)" /> TeamSync
        </Link>
        <nav className="nav-links">
          <Link to="/" className="btn btn-secondary">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <FolderKanban size={18} /> Projects
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--surface-border)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {user.name} <span className={`badge badge-${user.role?.toLowerCase() || 'member'}`}>{user.role || 'MEMBER'}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px' }} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
