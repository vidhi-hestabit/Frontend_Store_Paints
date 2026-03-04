import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { Link } from 'react-router-dom';

const RelatedProduct = ({ category }) => {
    const { products, addToCart } = useContext(AppContext);
    const [relatedProduct, setRelatedProduct] = useState([]);

    useEffect(() => {
        setRelatedProduct(products.filter(d => d?.category?.toLowerCase() === category?.toLowerCase()));
    }, [category, products]);

    return (
        <div className="product-grid" style={{ padding: 0 }}>
            {relatedProduct.map((product) => (
                <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`} className="product-card-img-wrap">
                        <img src={product.imgSrc} alt={product.title} />
                    </Link>
                    <div className="product-card-body">
                        <p className="product-card-title">{product.title}</p>
                        <p className="product-card-price">₹{product.price}</p>
                        <div className="product-card-actions">
                            <button
                                className="btn-paint-accent"
                                style={{ flex: 1, fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                                onClick={() => addToCart(product._id, product.title, product.price, 1, product.imgSrc)}
                            >
                                Add to Cart
                            </button>
                            <Link to={`/product/${product._id}`} style={{ flex: 1 }}>
                                <button className="btn-paint-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}>
                                    View
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RelatedProduct;