import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useContext(AppContext);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
};

export default AdminRoute;