import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
    const { logout, user } = useContext(AppContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { to: '/admin/products', label: 'Products', icon: '🎨' },
        { to: '/admin/orders', label: 'Orders', icon: '📦' },
        { to: '/admin/users', label: 'Users', icon: '👥' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-brand">
                        <span className="admin-brand-icon">🎨</span>
                        <div>
                            <div className="admin-brand-name">Ajmera Paints</div>
                            <div className="admin-brand-role">Admin Panel</div>
                        </div>
                    </div>
                </div>

                <nav className="admin-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <div className="admin-user-name">{user?.name || 'Admin'}</div>
                            <div className="admin-user-email">{user?.email || ''}</div>
                        </div>
                    </div>
                    <div className="admin-footer-actions">
                        <a href="/" className="admin-footer-btn" title="View store" target="_blank" rel="noreferrer">
                            Store🏪
                        </a>
                        <button className="admin-footer-btn logout" onClick={handleLogout} title="Logout">
                            Logout🚪
                        </button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <button className="admin-hamburger" onClick={() => setSidebarOpen(o => !o)}>
                        <span></span><span></span><span></span>
                    </button>
                    <div className="admin-topbar-right">
                        <span className="admin-topbar-user">{user?.name || 'Admin'}</span>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;