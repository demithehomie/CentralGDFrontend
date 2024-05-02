import  /*React,*/{ createContext, useState, useContext, useEffect } from 'react';

//import jwt, { JwtPayload } from 'jsonwebtoken';
//import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getToken } from '../../services/UsersService';
import { API_URL } from '../../services/apiService';
//import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  token: string;
  name: string;
}

interface AuthContextType {
  currentUser: User | null; 
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<void>; 
  verifySession: () => boolean; 
}


const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  verifyToken: async () => {}, 
  verifySession: () => false, 
});


export const useAuth = () => useContext(AuthContext);

const apiurl = API_URL;

export const AuthProvider = ({ children }: any) => {
 // const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);



    const token = getToken()

    const login = async (username: any, password: any) => {
      try {
        const response = await axios.post(`${apiurl}/new-login-method`, { username, password },   {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { accessToken, name } = response.data;
        const timestamp = new Date().getTime(); // Timestamp atual em milissegundos
        localStorage.setItem('token', accessToken);
        localStorage.setItem('timestamp', timestamp.toString());
        setCurrentUser({ username, name, token: accessToken });
        return true;
      } catch (error) {
        console.error('Erro durante a operação de login:', error);
        logout();
        return false;
      }
    };
    

    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const timestamp = localStorage.getItem('timestamp');
      const now = new Date().getTime();
    
      if (!token || !timestamp || now - parseInt(timestamp) > 28800000) { // 8 HORAS = 28800000 milissegundos
        logout(); // Isso vai remover o token e o usuário atual
        return;
      }
    
      // Se o token ainda não expirou, prossiga com a verificação no servidor
      try {
        const response = await axios.post(`${apiurl}/new-verify-token-method`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { user } = response.data;
        setCurrentUser({ username: user.username, name: user.name, token });
      } catch (error) {
        console.error('Erro durante a verificação do token:', error);
        logout();
      }
    };


    
    

useEffect(() => { // ALEGA QUE NÃO É NECESSÁRIO E EU VOU ACREDITA RPOR ENQUANTO
  verifyToken();
}, []);

// Dentro do seu AuthContext ou onde você define useAuth

const verifySession = (): boolean => {
  // Sua lógica existente para verificar a sessão
  // Por exemplo, verificar um token ou timestamp no localStorage
  
  // Certifique-se de que todos os caminhos de retorno sejam booleanos
  // Se a sessão for válida, retorne true; caso contrário, retorne false

  const token = localStorage.getItem('token');
  const timestamp = localStorage.getItem('timestamp');
  const now = new Date().getTime();

  if (token && timestamp) {
    const sessionDuration = now - parseInt(timestamp);
    const sessionIsValid = sessionDuration <= 86400000; // Por exemplo, 1 dia = 86400000 milissegundos
    return sessionIsValid;
  }

  // Se não houver token ou timestamp, ou se a sessão expirou, retorne false
  return false;
};



// useEffect(() => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     verifyToken(token); // Verifica o token e define o usuário se válido
//   }
// }, []);



// useEffect(() => {
//   const token = localStorage.getItem('token');
//   const timestamp = localStorage.getItem('timestamp');
//   const now = new Date().getTime();

//   if (token && timestamp && now - parseInt(timestamp) < 1800000) { // 30 minutos = 1800000 milissegundos
//     setCurrentUser(1);
//     // Opcional: Verifique no backend se o token ainda é válido
//   } else {
//     localStorage.removeItem('token');
//     localStorage.removeItem('timestamp');
//     setCurrentUser(null);
//   }
// }, []);



// Incluir a chamada de verifyToken no PrivateRoute ou de maneira apropriada

  

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('timestamp'); // Se você estiver usando um timestamp para a sessão
  
      // Atualiza o estado da aplicação, se necessário
      // Por exemplo, se você tiver um estado `currentUser` no contexto de autenticação:
      setCurrentUser(null);
  
      // Redireciona o usuário para a página de login ou para a home
      // Isso pode depender de como você está gerenciando rotas na sua aplicação
      //navigate('/')
    };

    const value = {
        currentUser,
        login,
        logout,
        verifyToken,
        verifySession
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
