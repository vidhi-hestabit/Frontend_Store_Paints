import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../context/AppContext';

const TableProduct = ({ cart }) => {
    const { decreaseQty, addToCart, removeFromCart } = useContext(AppContext);
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        let q = 0, p = 0;
        if (cart?.items) {
            cart.items.forEach(item => { q += item.qty; p += item.price; });
        }
        setPrice(p);
        setQty(q);
    }, [cart]);

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="paint-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart?.items?.map((product) => (
                        <tr key={product._id}>
                            <td><img src={product.imgSrc} alt={product.title} /></td>
                            <td style={{ fontWeight: 600 }}>{product.title}</td>
                            <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{product.price}</td>
                            <td>{product.qty}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                    <button className="qty-btn" onClick={() => decreaseQty(product?.productId, 1)}>−</button>
                                    <button className="qty-btn" onClick={() => addToCart(product?.productId, product.title, product.price / product.qty, 1, product.imgSrc)}>+</button>
                                    <button className="btn-paint-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                                        onClick={() => { if (confirm("Remove this item?")) removeFromCart(product?.productId); }}>
                                        ✕
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    <tr className="tfoot-row">
                        <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>Total</td>
                        <td style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>₹{price}</td>
                        <td style={{ fontWeight: 700 }}>{qty}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableProduct;