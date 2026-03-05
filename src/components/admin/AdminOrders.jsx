import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLOR = {
    Processing: '#f59e0b', Confirmed: '#3b82f6', Shipped: '#8b5cf6',
    'Out for Delivery': '#f97316', Delivered: '#10b981', Cancelled: '#ef4444',
};

const adminOrders = () => {
    const { url, token } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [search, setSearch] = useState('');
    const toastOpts = { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/admin/orders`, { headers: { Auth: token } });
            setOrders(res.data.orders || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchOrders(); }, [token]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${url}/admin/orders/${orderId}/status`,
                { orderStatus: newStatus },
                { headers: { Auth: token } }
            );
            toast.success(`Order marked as ${newStatus}`, toastOpts);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (e) {
            toast.error('Update failed', toastOpts);
        }
    };

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'All' || (o.orderStatus || 'Processing') === filterStatus;
        const matchSearch = !search ||
            (o.orderId || o._id)?.toLowerCase().includes(search.toLowerCase()) ||
            o.userShipping?.fullName?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Orders</h1>
                    <p className="admin-page-subtitle">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card admin-filters-row">
                <input className="admin-search-input" style={{ flex: 1 }}
                    placeholder="Search by order ID or customer name..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                <div className="admin-filter-chips">
                    {['All', ...STATUS_OPTIONS].map(s => (
                        <button key={s}
                            className={`admin-chip ${filterStatus === s ? 'admin-chip-active' : ''}`}
                            style={filterStatus === s && s !== 'All' ? { background: STATUS_COLOR[s] + '22', color: STATUS_COLOR[s], borderColor: STATUS_COLOR[s] } : {}}
                            onClick={() => setFilterStatus(s)}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" />Loading...</div>
            ) : (
                <div className="admin-orders-list">
                    {filtered.length === 0 && <div className="admin-card admin-empty-text" style={{ padding: '3rem', textAlign: 'center' }}>No orders found</div>}
                    {filtered.map(order => {
                        const status = order.orderStatus || 'Processing';
                        const isExpanded = expandedId === order._id;
                        return (
                            <div key={order._id} className="admin-order-card">
                                <div className="admin-order-row" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                                    <div className="admin-order-col">
                                        <div className="admin-order-id-text">#{(order.orderId || order._id)?.slice(-10)}</div>
                                        <div className="admin-order-date-text">{new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                    </div>
                                    <div className="admin-order-col">
                                        <div className="admin-order-customer">{order.userShipping?.fullName || 'N/A'}</div>
                                        <div className="admin-order-phone">{order.userShipping?.phoneNumber || ''}</div>
                                    </div>
                                    <div className="admin-order-col admin-order-amount-col">₹{order.amount}</div>
                                    <div className="admin-order-col" onClick={e => e.stopPropagation()}>
                                        <select
                                            className="admin-status-select"
                                            value={status}
                                            onChange={e => updateStatus(order._id, e.target.value)}
                                            style={{ borderColor: STATUS_COLOR[status], color: STATUS_COLOR[status] }}>
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="admin-order-col admin-order-expand">
                                        <span className={`admin-expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="admin-order-detail">
                                        <div className="admin-order-detail-grid">
                                            <div>
                                                <h4 className="admin-detail-section-title">📦 Order Items</h4>
                                                <table className="admin-mini-table">
                                                    <thead><tr><th>Image</th><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                                                    <tbody>
                                                        {order.orderItems?.map((item, i) => (
                                                            <tr key={i}>
                                                                <td><img src={item.imgSrc} alt={item.title} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, background: 'var(--bg2)' }} /></td>
                                                                <td>{item.title}</td>
                                                                <td>{item.qty}</td>
                                                                <td>₹{item.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div>
                                                <h4 className="admin-detail-section-title">🚚 Shipping Address</h4>
                                                <ul className="admin-detail-list">
                                                    <li><span>Name</span><span>{order.userShipping?.fullName}</span></li>
                                                    <li><span>Phone</span><span>{order.userShipping?.phoneNumber}</span></li>
                                                    <li><span>Address</span><span>{order.userShipping?.address}</span></li>
                                                    <li><span>City</span><span>{order.userShipping?.city}</span></li>
                                                    <li><span>State</span><span>{order.userShipping?.state}</span></li>
                                                    <li><span>Pincode</span><span>{order.userShipping?.pincode}</span></li>
                                                    <li><span>Country</span><span>{order.userShipping?.country}</span></li>
                                                </ul>
                                                <h4 className="admin-detail-section-title" style={{ marginTop: '1rem' }}>💳 Payment</h4>
                                                <ul className="admin-detail-list">
                                                    <li><span>Order ID</span><span style={{ fontSize: '0.75rem' }}>{order.orderId}</span></li>
                                                    <li><span>Payment ID</span><span style={{ fontSize: '0.75rem' }}>{order.paymentId}</span></li>
                                                    <li><span>Status</span><span>{order.payStatus}</span></li>
                                                    <li><span>Amount</span><span>₹{order.amount}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default adminOrders;