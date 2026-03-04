import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) navigate('/login');
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--light)' }}>
            <div className="paint-form-card" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>✨</div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Join the Ajmera Paints family today</p>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Full Name</label>
                        <input name="name" value={formData.name} onChange={onChangeHandler} type="text" className="paint-form-input" placeholder="Your name" />
                    </div>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Email Address</label>
                        <input name="email" value={formData.email} onChange={onChangeHandler} type="email" className="paint-form-input" placeholder="you@example.com" />
                    </div>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Password</label>
                        <input name="password" value={formData.password} onChange={onChangeHandler} type="password" className="paint-form-input" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-paint-accent" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;