import React, { useEffect, useState } from 'react';
import AppContext from './AppContext.jsx';
import axios from 'axios';
import { toast, Bounce } from "react-toastify";

const AppState = (props) => {
    const url = import.meta.env.VITE_API_URL?.replace(/\/$/, '') + '/api';
    // const url = "http://localhost:5000/api";
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [user, setUser] = useState();
    const [cart, setCart] = useState([]);
    const [reload, setReload] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [userOrder, setUserOrder] = useState([]);

    useEffect(() => {
        const lstoken = localStorage.getItem('token');
        const lsAdmin = localStorage.getItem('isAdmin') === 'true';
        if (lstoken) {
            setToken(lstoken);
            setIsAuthenticated(true);
            setIsAdmin(lsAdmin);
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            const api = await axios.get(`${url}/product/all`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            setProducts(api.data.products);
            setFilteredData(api.data.products);
            if (token) userProfile();
        };
        fetchProduct();
        if (token) {
            userCart();
            getAddress();
            user_Order();
        }
    }, [token, reload]);

    const toastOpts = {
        position: "top-right", autoClose: 1500, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
        theme: "dark", transition: Bounce,
    };

    const register = async (name, email, password) => {
        const api = await axios.post(`${url}/user/register`, { name, email, password }, {
            headers: { "Content-Type": "application/json" }, withCredentials: true
        });
        toast.success(api.data.message, toastOpts);
        return api.data;
    };

    const login = async (email, password) => {
        const api = await axios.post(`${url}/user/login`, { email, password }, {
            headers: { "Content-Type": "application/json" }, withCredentials: true
        });
        toast.success(api.data.message, toastOpts);
        setToken(api.data.token);
        setIsAuthenticated(true);
        setIsAdmin(api.data.isAdmin || false);
        localStorage.setItem("token", api.data.token);
        localStorage.setItem("isAdmin", api.data.isAdmin ? 'true' : 'false');
        return api.data;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setToken('');
        setUser(null);
        setCart([]);
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        toast.success("Logout Successfully...!", toastOpts);
    };

    const userProfile = async () => {
        const api = await axios.get(`${url}/user/profile`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setUser(api.data.user);
    };

    const addToCart = async (productId, title, price, qty, imgSrc) => {
        const api = await axios.post(`${url}/cart/add`, { productId, title, price, qty, imgSrc }, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setReload(!reload);
        toast.success(api.data.message, toastOpts);
    };

    const userCart = async () => {
        const api = await axios.get(`${url}/cart/user`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setCart(api.data.cart);
    };

    const decreaseQty = async (productId, qty) => {
        const api = await axios.post(`${url}/cart/--qty`, { productId, qty }, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setReload(!reload);
        toast.success(api.data.message, toastOpts);
    };

    const removeFromCart = async (productId) => {
        const api = await axios.delete(`${url}/cart/remove/${productId}`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setReload(!reload);
        toast.success(api.data.message, toastOpts);
    };

    const clearCart = async () => {
        const api = await axios.delete(`${url}/cart/clear`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setReload(!reload);
        toast.success(api.data.message, toastOpts);
    };

    const shippingAddress = async (fullName, address, city, state, country, pincode, phoneNumber) => {
        const api = await axios.post(`${url}/address/add`,
            { fullName, address, city, state, country, pincode, phoneNumber },
            { headers: { "Content-Type": "application/json", Auth: token }, withCredentials: true }
        );
        setReload(!reload);
        toast.success(api.data.message, toastOpts);
        return api.data;
    };

    const getAddress = async () => {
        const api = await axios.get(`${url}/address/get`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setUserAddress(api.data.userAddress);
    };

    const user_Order = async () => {
        const api = await axios.get(`${url}/payment/userorder`, {
            headers: { "Content-Type": "application/json", Auth: token },
            withCredentials: true,
        });
        setUserOrder(api.data);
    };

    return (
        <AppContext.Provider value={{
            products, register, login, url, token,
            setIsAuthenticated, isAuthenticated, isAdmin,
            filteredData, setFilteredData, logout, user,
            addToCart, cart, decreaseQty, removeFromCart,
            clearCart, shippingAddress, userAddress, userOrder,
            reload, setReload,
        }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;