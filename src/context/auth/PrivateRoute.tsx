import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext' // Ajuste o caminho conforme necessário

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
