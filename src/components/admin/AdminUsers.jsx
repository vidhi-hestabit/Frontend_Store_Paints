import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

const adminUsers = () => {
    const { url, token, user: currentUser } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const toastOpts = { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/admin/users`, { headers: { Auth: token } });
            setUsers(res.data.users || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchUsers(); }, [token]);

    const toggleadmin = async (userId, currentIsadmin) => {
        const action = currentIsadmin ? 'remove-admin' : 'make-admin';
        const confirmMsg = currentIsadmin
            ? 'Remove admin role from this user?'
            : 'Grant admin access to this user?';
        if (!window.confirm(confirmMsg)) return;
        try {
            await axios.put(`${url}/api/user/${userId}/${action}`, {}, { headers: { Auth: token } });
            toast.success(currentIsadmin ? 'admin role removed' : 'User is now an admin', toastOpts);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isadmin: !currentIsadmin } : u));
        } catch (e) {
            toast.error('Update failed', toastOpts);
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Users</h1>
                    <p className="admin-page-subtitle">{users.length} registered users</p>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <input className="admin-search-input" placeholder="Search by name or email..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" />Loading...</div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="admin-empty-text" style={{ padding: '2rem', textAlign: 'center' }}>No users found</td></tr>
                            )}
                            {filtered.map(u => (
                                <tr key={u._id} className={u._id === currentUser?._id ? 'admin-current-user-row' : ''}>
                                    <td>
                                        <div className="admin-user-cell">
                                            <div className="admin-user-avatar" style={{ width: 36, height: 36, fontSize: '0.9rem', flexShrink: 0 }}>
                                                {u.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{u.name}</div>
                                                {u._id === currentUser?._id && <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>You</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>{u.email}</td>
                                    <td>
                                        <span className={`admin-role-badge ${u.isadmin ? 'admin' : 'user'}`}>
                                            {u.isadmin ? '👑 admin' : '👤 User'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                    </td>
                                    <td>
                                        {u._id !== currentUser?._id ? (
                                            <button
                                                className={u.isadmin ? 'admin-btn-danger-sm' : 'admin-btn-primary-sm'}
                                                onClick={() => toggleadmin(u._id, u.isadmin)}>
                                                {u.isadmin ? 'Remove admin' : 'Make admin'}
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current user</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default adminUsers;