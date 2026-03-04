import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { Link, useParams } from 'react-router-dom';

const SearchProduct = () => {
    const { products, addToCart } = useContext(AppContext);
    const [searchProduct, setSearchProduct] = useState([]);
    const { term } = useParams();

    useEffect(() => {
        setSearchProduct(products.filter(d => d?.title?.toLowerCase().includes(term.toLowerCase())));
    }, [term, products]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>
                Search results for "<span style={{ color: 'var(--primary)' }}>{term}</span>"
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{searchProduct.length} products found</p>

            <div className="product-grid" style={{ padding: 0 }}>
                {searchProduct.map((product) => (
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

            {searchProduct.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.3 }}>search_off</span>
                    <h3>No products found</h3>
                    <p>Try a different search term</p>
                </div>
            )}
        </div>
    );
};

export default SearchProduct;