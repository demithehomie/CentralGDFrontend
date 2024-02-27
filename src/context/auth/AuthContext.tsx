import  /*React,*/{ createContext, useState, useContext, useEffect } from 'react';

//import jwt, { JwtPayload } from 'jsonwebtoken';
//import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  username: string;
  token: string;
  name: string;
}

interface AuthContextType {
  currentUser: User | null; // Substitua 'any' pelo tipo apropriado
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<void>; // Adicione esta linha
}


const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  verifyToken: async () => {} // Adicione esta linha: Implementação stub para verifyToken
});


export const useAuth = () => useContext(AuthContext);

//const apiurldev = `http://localhost:3001`;

const apiurl = `https://gdcompanion-prod.onrender.com`

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);






    const login = async (username: any, password: any) => {
      try {
        const response = await axios.post(`${apiurl}/new-login-method`, { username, password });
        const { accessToken, name } = response.data; // Add 'name' to destructured response data
        localStorage.setItem('token', accessToken);
        localStorage.setItem('timestamp', new Date().getTime().toString());
        setCurrentUser({username, name, token: accessToken});
        return true;
      } catch (error) {
        console.error('Erro durante a operação de login:', error);
        return false;
      }
    };
    

    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post(`${apiurl}/new-verify-token-method`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Supondo que o backend retorne os detalhes do usuário junto com a mensagem de sucesso
          const { user } = response.data;
          setCurrentUser({ username: user.username, name: user.name, token }); // Atualiza com detalhes completos do usuário
        } catch (error) {
          // Fazendo cast do 'error' para o tipo 'Error' para acessar a propriedade 'message'
          if (error instanceof Error) {
            console.error('Erro durante a verificação do token:', error.message);
          } else {
            console.error('Erro durante a verificação do token:', error);
          }
          logout();
        }
      }
    };
    

useEffect(() => {
  verifyToken();
}, []);


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
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout,
        verifyToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
