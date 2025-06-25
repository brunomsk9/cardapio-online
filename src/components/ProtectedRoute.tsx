
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole'; 

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


