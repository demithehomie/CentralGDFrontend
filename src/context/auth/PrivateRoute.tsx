import React, { ComponentType } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
    component: ComponentType;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route {...rest} path={rest.path} element={currentUser ? <Component /> : <Navigate to="/login" />} />
    );
};

export default PrivateRoute;
