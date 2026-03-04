import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RelatedProduct from './RelatedProduct';
import AppContext from '../../context/AppContext';

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    const { id } = useParams();
    const { addToCart } = useContext(AppContext);
    const url = "https://paint-store-alpha.vercel.app/api";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const api = await axios.get(`${url}/product/${id}`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
                setProduct(api.data.product);
            } catch (error) {
                console.error("Error fetching the product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    return (
        <>
            <div className="product-detail-page">
                <div className="product-detail-img-wrap">
                    <img src={product?.imgSrc} alt={product?.title} />
                </div>

                <div className="product-detail-info">
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {product?.category}
                    </p>
                    <h1>{product?.title}</h1>
                    <p>{product?.description}</p>
                    <div className="product-detail-price">
                        ₹{product?.price} <span>/ unit</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn-paint-primary"
                            style={{ padding: '0.7rem 2rem', fontSize: '1rem' }}
                            onClick={() => addToCart(product._id, product.title, product.price, 1, product.imgSrc)}
                        >
                            Add to Cart
                        </button>
                        <button className="btn-paint-outline" style={{ padding: '0.7rem 2rem', fontSize: '1rem' }}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 3rem' }}>
                <h2 className="section-title">Related Products</h2>
                <RelatedProduct category={product?.category} />
            </div>
        </>
    );
};

export default ProductDetail;