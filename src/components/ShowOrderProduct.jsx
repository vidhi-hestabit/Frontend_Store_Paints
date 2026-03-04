import React, { useEffect, useState } from 'react';

const ShowOrderProduct = ({ items }) => {
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        let q = 0, p = 0;
        if (items) items.forEach(item => { q += item.qty; p += item.price; });
        setPrice(p);
        setQty(q);
    }, [items]);

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="paint-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((product) => (
                        <tr key={product._id}>
                            <td><img src={product.imgSrc} alt={product.title} /></td>
                            <td style={{ fontWeight: 600 }}>{product.title}</td>
                            <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{product.price}</td>
                            <td>{product.qty}</td>
                        </tr>
                    ))}
                    <tr className="tfoot-row">
                        <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>Total</td>
                        <td style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>₹{price}</td>
                        <td style={{ fontWeight: 700 }}>{qty}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ShowOrderProduct;