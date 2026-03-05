import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading,  setLoading]  = useState(false);

    const onChangerHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);
        if (result?.success) {
            // Admin → admin panel, regular user → home
            navigate(result.isAdmin ? '/admin' : '/');
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)' }}>
            <div className="paint-form-card" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>🎨</div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Sign in to your Ajmera Paints account</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Email Address</label>
                        <input name="email" value={formData.email} onChange={onChangerHandler}
                            type="email" className="paint-form-input" placeholder="you@example.com" required />
                    </div>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Password</label>
                        <input name="password" value={formData.password} onChange={onChangerHandler}
                            type="password" className="paint-form-input" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn-paint-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;