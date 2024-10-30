import React from 'react';
import { Navigate } from 'react-router-dom';

const getUserRole = () => {
  return localStorage.getItem('userRole'); // Obtiene el rol del usuario
};

const ProtectedRoute = ({ children, requiredRoles, redirectPath = "/unauthorized" }) => {
  const userRole = getUserRole();
  const isAuthenticated = !!userRole;

  if (!isAuthenticated || (requiredRoles && !requiredRoles.includes(userRole))) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
