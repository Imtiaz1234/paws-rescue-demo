import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.token) return <Navigate to="/login" replace />;

  // If specific role is required, check it
  if (role && auth.user?.role !== role) {
    return <div>Access denied. This page is for {role} users only.</div>;
  }

  return children;
};

export default ProtectedRoute;