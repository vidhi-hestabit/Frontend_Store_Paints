import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

const CATEGORIES = ['Interior', 'Exterior', 'Primer', 'Distemper', 'Emulsion', 'Stainer', 'Brush', 'Stensils'];

const EMPTY_FORM = { title: '', description: '', price: '', category: '', qty: '', imgSrc: '' };

const adminProducts = () => {
    const { url, token } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const toastOpts = { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/admin/products`, { headers: { Auth: token } });
            setProducts(res.data.products || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchProducts(); }, [token]);

    const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (p) => { setEditProduct(p); setForm({ title: p.title, description: p.description, price: p.price, category: p.category, qty: p.qty, imgSrc: p.imgSrc }); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditProduct(null); setForm(EMPTY_FORM); };

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editProduct) {
                await axios.put(`${url}/admin/products/${editProduct._id}`, form, { headers: { Auth: token } });
                toast.success('Product updated!', toastOpts);
            } else {
                await axios.post(`${url}/admin/products`, form, { headers: { Auth: token } });
                toast.success('Product added!', toastOpts);
            }
            closeModal();
            fetchProducts();
        } catch (e) {
            toast.error('Something went wrong', toastOpts);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;
        try {
            await axios.delete(`${url}/admin/products/${id}`, { headers: { Auth: token } });
            toast.success('Product deleted!', toastOpts);
            fetchProducts();
        } catch (e) {
            toast.error('Delete failed', toastOpts);
        }
    };

    const filtered = products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Products</h1>
                    <p className="admin-page-subtitle">{products.length} products in store</p>
                </div>
                <button className="admin-btn-primary" onClick={openAdd}>+ Add Product</button>
            </div>

            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <input className="admin-search-input" placeholder="Search by name or category..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" />Loading...</div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th><th>Title</th><th>Category</th>
                                <th>Price</th><th>Stock</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="admin-empty-text" style={{ padding: '2rem', textAlign: 'center' }}>No products found</td></tr>
                            )}
                            {filtered.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        <img src={p.imgSrc} alt={p.title} className="admin-product-thumb"
                                            onError={e => e.target.src = 'https://via.placeholder.com/48'} />
                                    </td>
                                    <td className="admin-td-title">{p.title}</td>
                                    <td><span className="admin-cat-badge">{p.category}</span></td>
                                    <td className="admin-td-price">₹{p.price}</td>
                                    <td>
                                        <span className={`admin-stock-badge ${p.qty < 5 ? 'low' : ''}`}>{p.qty}</span>
                                    </td>
                                    <td>
                                        <div className="admin-action-btns">
                                            <button className="admin-btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                                            <button className="admin-btn-delete" onClick={() => handleDelete(p._id, p.title)}>🗑️ Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="admin-modal-body">
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Title</label>
                                    <input name="title" value={form.title} onChange={handleChange} required placeholder="Product name" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Category</label>
                                    <select name="category" value={form.category} onChange={handleChange} required>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Product description" />
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Price (₹)</label>
                                    <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required placeholder="0" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Stock Quantity</label>
                                    <input name="qty" type="number" min="0" value={form.qty} onChange={handleChange} required placeholder="0" />
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Image URL</label>
                                <input name="imgSrc" value={form.imgSrc} onChange={handleChange} required placeholder="https://..." />
                                {form.imgSrc && (
                                    <img src={form.imgSrc} alt="preview" className="admin-img-preview"
                                        onError={e => e.target.style.display = 'none'} />
                                )}
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn-ghost" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="admin-btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default adminProducts;