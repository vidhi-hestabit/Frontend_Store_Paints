import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const categories = [
    { label: 'All', value: 'all', icon: '🎨' },
    { label: 'Brushes', value: 'Brush', icon: '🖌️' },
    { label: 'Stainer', value: 'Stainer', icon: '🪣' },
    { label: 'Exterior', value: 'Exterior', icon: '🏠' },
    { label: 'Interior', value: 'Interior', icon: '🛋️' },
    { label: 'Primer', value: 'Primer', icon: '🧴' },
    { label: 'Distemper', value: 'Distemper', icon: '🌫️' },
    { label: 'Stencils', value: 'Stensils', icon: '✨' },
    { label: 'Emulsion', value: 'Emulsion', icon: '💧' },
];

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setFilteredData, products, logout, isAuthenticated, cart } = useContext(AppContext);
    const { theme, toggleTheme } = useTheme();
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const filterByCategory = (cat) => {
        setActiveCategory(cat.value);
        if (cat.value === 'all') {
            setFilteredData(products);
        } else {
            setFilteredData(products.filter(d => d.category.toLowerCase() === cat.value.toLowerCase()));
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product/search/${searchTerm}`);
            setSearchTerm('');
        }
    };

    const cartCount = cart?.items?.length || 0;

    return (
        <nav className="navbar-root sticky-top" ref={menuRef}>
            <div className="navbar-main">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎨</div>
                    <div className="navbar-brand-text">
                        <span className="brand-name">Ajmera</span>
                        <span className="brand-sub">Paints</span>
                    </div>
                </Link>

                <form className={`navbar-search ${searchFocused ? 'focused' : ''}`} onSubmit={submitHandler}>
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        type="text"
                        placeholder="Search paints, brushes, primers..."
                    />
                    {searchTerm && (
                        <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                        </button>
                    )}
                </form>

                <div className="navbar-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        <span className="theme-toggle-track">
                            <span className="theme-toggle-thumb">
                                {theme === 'light' ? '☀️' : '🌙'}
                            </span>
                        </span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="navbar-cart-btn">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>shopping_cart</span>
                                <span className="navbar-cart-label">Cart</span>
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </Link>
                            <Link to="/profile" className="navbar-icon-btn profile-btn" title="Profile">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>account_circle</span>
                            </Link>
                            <button
                                className="navbar-logout-btn"
                                onClick={() => { logout(); navigate('/'); }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>logout</span>
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/about" className="navbar-link-subtle">About</Link>
                            <Link to="/contact" className="navbar-link-subtle">Contact</Link>
                            <Link to="/login" className="navbar-btn-ghost">Login</Link>
                            <Link to="/register" className="navbar-btn-solid">Register</Link>
                        </>
                    )}

                    <button
                        className="navbar-hamburger"
                        onClick={() => setMobileMenuOpen(o => !o)}
                        aria-label="Menu"
                    >
                        <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`ham-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>

            {location.pathname === '/' && (
                <div className="navbar-categories">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            className={`cat-chip ${activeCategory === cat.value ? 'active' : ''}`}
                            onClick={() => filterByCategory(cat)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {mobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <form className="mobile-search" onSubmit={submitHandler}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>search</span>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search products..."
                        />
                    </form>

                    {isAuthenticated ? (
                        <div className="mobile-nav-links">
                            <Link to="/cart" className="mobile-nav-link">
                                🛒 Cart {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
                            </Link>
                            <Link to="/profile" className="mobile-nav-link">👤 Profile</Link>
                            <button className="mobile-nav-link mobile-logout" onClick={() => { logout(); navigate('/'); }}>
                                🚪 Logout
                            </button>
                        </div>
                    ) : (
                        <div className="mobile-nav-links">
                            <Link to="/login" className="mobile-nav-link">🔑 Login</Link>
                            <Link to="/register" className="mobile-nav-link">✨ Register</Link>
                            <Link to="/about" className="mobile-nav-link">ℹ️ About</Link>
                            <Link to="/contact" className="mobile-nav-link">📞 Contact</Link>
                        </div>
                    )}

                    <div className="mobile-theme-row">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {theme === 'light' ? '☀️ Light mode' : '🌙 Dark mode'}
                        </span>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            <span className="theme-toggle-track">
                                <span className="theme-toggle-thumb">
                                    {theme === 'light' ? '☀️' : '🌙'}
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;