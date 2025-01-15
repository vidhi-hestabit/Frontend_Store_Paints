import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../context/AppContext';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { setFilteredData, products, logout, isAuthenticated, cart } = useContext(AppContext);

    const filterByCategory = (cat) => {
        setFilteredData(
            products.filter(
                (data) => data.category.toLowerCase() === cat.toLowerCase()
            )
        );
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product/search/${searchTerm}`);
        }
    };

    return (
        <>
            <div className="nav sticky-top">
                <div className="nav_bar">
                    <Link to="/" className="left" style={{ textDecoration: 'none', color: 'white' }}>
                        <h3>Ajmera Paints</h3>
                    </Link>
                    <form className="search_bar" onSubmit={submitHandler}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search products..."
                        />
                    </form>
                    <div className="right">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={"/cart"}
                                    type="button"
                                    className="btn btn-primary position-relative mx-3"
                                >
                                    <span className="material-symbols-outlined">
                                        shopping_cart
                                    </span>

                                    {cart?.items?.length > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cart?.items?.length}
                                            <span className="visually-hidden">unread messages</span>
                                        </span>
                                    )}
                                </Link>
                                <Link to='/profile' className="btn btn-primary mx-2">Profile</Link>
                                <button
                                    className="btn btn-danger mx-2"
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary mx-2">Login</Link>
                                <Link to="/register" className="btn btn-primary mx-2">Register</Link>
                                <Link to="/about" className="btn btn-info mx-2">About Us</Link>
                                <Link to="/contact" className="btn btn-info mx-2">Contact Us</Link>
                            </>
                        )}
                    </div>
                </div>

                {location.pathname === '/' && (
                    <div className="sub_bar">
                        <div className="items" onClick={() => setFilteredData(products)}>No Filter</div>
                        <div className="items" onClick={() => filterByCategory('Brush')}>Brushes</div>
                        <div className="items" onClick={() => filterByCategory('Stainer')}>Stainer</div>
                        <div className="items" onClick={() => filterByCategory('Exterior')}>Exterior</div>
                        <div className="items" onClick={() => filterByCategory('Interior')}>Interior</div>
                        <div className="items" onClick={() => filterByCategory('Primer')}>Primer</div>
                        <div className="items" onClick={() => filterByCategory('Distemper')}>Distemper</div>
                        <div className="items" onClick={() => filterByCategory('Stensils')}>Stensils</div>
                        <div className="items" onClick={() => filterByCategory('Emulsion')}>Emulsion</div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Navbar;
