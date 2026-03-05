import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import axios from 'axios';

const StatCard = ({ icon, label, value, color }) => (
    <div className="admin-stat-card">
        <div className="admin-stat-icon" style={{ background: color }}>{icon}</div>
        <div>
            <div className="admin-stat-value">{value}</div>
            <div className="admin-stat-label">{label}</div>
        </div>
    </div>
);

const STATUS_COLORS = {
    Processing: '#f59e0b', Confirmed: '#3b82f6', Shipped: '#8b5cf6',
    'Out for Delivery': '#f97316', Delivered: '#10b981', Cancelled: '#ef4444',
};

const AdminDashboard = () => {
    const { url, token } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${url}/admin/dashboard`, {
                    headers: { Auth: token }
                });
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetch();
    }, [token]);

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Dashboard</h1>
                <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="admin-stats-grid">
                <StatCard icon="📦" label="Total Orders" value={data?.stats?.totalOrders || 0} color="rgba(99,102,241,0.15)" />
                <StatCard icon="🎨" label="Products" value={data?.stats?.totalProducts || 0} color="rgba(200,69,26,0.15)" />
                <StatCard icon="👥" label="Users" value={data?.stats?.totalUsers || 0} color="rgba(16,185,129,0.15)" />
                <StatCard icon="₹" label="Revenue" value={`₹${(data?.stats?.totalRevenue || 0).toLocaleString()}`} color="rgba(245,158,11,0.15)" />
            </div>

            <div className="admin-row-2">
                <div className="admin-card">
                    <h3 className="admin-card-title">Orders by Status</h3>
                    <div className="admin-status-bars">
                        {Object.entries(data?.ordersByStatus || {}).map(([status, count]) => (
                            <div key={status} className="admin-status-bar-row">
                                <span className="admin-status-dot" style={{ background: STATUS_COLORS[status] }}></span>
                                <span className="admin-status-name">{status}</span>
                                <div className="admin-status-bar-track">
                                    <div className="admin-status-bar-fill"
                                        style={{ width: `${Math.min(100, (count / (data?.stats?.totalOrders || 1)) * 100)}%`, background: STATUS_COLORS[status] }}>
                                    </div>
                                </div>
                                <span className="admin-status-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-card">
                    <h3 className="admin-card-title">Recent Orders</h3>
                    <div className="admin-recent-orders">
                        {data?.recentOrders?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No orders yet</p>}
                        {data?.recentOrders?.map(order => (
                            <div key={order._id} className="admin-recent-order-row">
                                <div>
                                    <div className="admin-order-id">#{order.orderId?.slice(-8) || order._id?.slice(-8)}</div>
                                    <div className="admin-order-date">{new Date(order.orderDate).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="admin-order-amount">₹{order.amount}</div>
                                    <span className="admin-status-badge" style={{ background: STATUS_COLORS[order.orderStatus || 'Processing'] + '22', color: STATUS_COLORS[order.orderStatus || 'Processing'] }}>
                                        {order.orderStatus || 'Processing'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;