import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
}

const isSessionValid = (): boolean => {
    const token = localStorage.getItem('token');
    const timestamp = localStorage.getItem('timestamp');
    if (!token || !timestamp) {
        return false; // Sem token ou timestamp, a sessão não é válida
    }

    const now = new Date().getTime();
    const sessionDuration = now - parseInt(timestamp, 10);
    const sessionIsValid = sessionDuration <= 3600000; // Exemplo: 1 hora = 3600000 milissegundos

    return sessionIsValid;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    if (!isSessionValid()) {
        // Se a sessão não for válida, redirecione para a página de login
        return <Navigate to="/" replace />;
    }

    // Se a sessão for válida, renderize os children do componente
    return <>{children}</>;
};

export default PrivateRoute;
