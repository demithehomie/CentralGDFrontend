import  { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext' // Ajuste o caminho conforme necessário

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser} = useAuth();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkToken = async () => {
        if (!currentUser) {
          setLoading(false);
          return;
        }
  
       // await verifyToken();
        setLoading(false);
      };
  
      checkToken();
    }, [currentUser]);
  
    if (loading) {
      return <div>Carregando...</div>; // Ou algum spinner/loader
    }
  
    return currentUser ? <>{children}</> : <Navigate to="/" />;
  };
  

export default PrivateRoute;
