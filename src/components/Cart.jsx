import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, decreaseQty, addToCart, removeFromCart, clearCart } = useContext(AppContext);
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let q = 0, p = 0;
        if (cart?.items) {
            cart.items.forEach(item => { q += item.qty; p += item.price; });
        }
        setPrice(p);
        setQty(q);
    }, [cart]);

    if (!cart?.items?.length) {
        return (
            <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add some products to get started</p>
                <button className="btn-paint-primary" style={{ padding: '0.7rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <button className="btn-paint-danger" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                    onClick={() => { if (confirm("Clear entire cart?")) clearCart(); }}>
                    Clear Cart
                </button>
            </div>

            <div className="cart-summary-bar">
                <div className="stat">
                    <span className="stat-label">Total Items</span>
                    <span className="stat-value">{qty}</span>
                </div>
                <div className="cart-divider"></div>
                <div className="stat">
                    <span className="stat-label">Total Price</span>
                    <span className="stat-value">₹{price}</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-paint-accent" style={{ padding: '0.6rem 1.5rem' }} onClick={() => navigate('/shipping')}>
                        Checkout →
                    </button>
                </div>
            </div>

            {cart.items.map((product) => (
                <div key={product._id} className="cart-item">
                    <img className="cart-item-img" src={product.imgSrc} alt={product.title} />
                    <div className="cart-item-info">
                        <p className="cart-item-title">{product.title}</p>
                        <p className="cart-item-price">₹{product.price}</p>
                        <p className="cart-item-qty">Qty: {product.qty}</p>
                    </div>
                    <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => decreaseQty(product?.productId, 1)}>−</button>
                        <span className="qty-display">{product.qty}</span>
                        <button className="qty-btn" onClick={() => addToCart(product?.productId, product.title, product.price / product.qty, 1, product.imgSrc)}>+</button>
                        <button className="btn-paint-danger" style={{ marginLeft: '0.5rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                            onClick={() => { if (confirm("Remove this item?")) removeFromCart(product?.productId); }}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                <button className="btn-paint-accent" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} onClick={() => navigate('/shipping')}>
                    Proceed to Checkout →
                </button>
            </div>
        </div>
    );
};

export default Cart;