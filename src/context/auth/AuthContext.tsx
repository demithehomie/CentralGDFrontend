import  /*React,*/{ createContext, useState, useContext, useEffect } from 'react';

//import jwt, { JwtPayload } from 'jsonwebtoken';
//import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  currentUser: User | null; // Substitua 'any' pelo tipo apropriado
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
 // verifyToken: () => Promise<void>; // Adicione esta linha
}


const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  //verifyToken: async () => {} // Adicione esta linha: Implementação stub para verifyToken
});


export const useAuth = () => useContext(AuthContext);

const apiurldev = `http://localhost:3001`;

//const apiurl = `https://gdcompanion-prod.onrender.com`

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
   // const [isLoading, setIsLoading] = useState(false);

// No seu contexto de autenticação

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // If a token is found in localStorage, you can consider the user as logged in


  }
}, []);



const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const loginResponse = await axios.post(`${apiurldev}/login-individual`, {
      username,
      password,
    });

    if (loginResponse.status === 200) {
      const { token, username } = loginResponse.data.data;
      localStorage.setItem('token', token); // Save token for persistence on the client
      setCurrentUser({ username, token });
      return true;
    } else {
      console.error('Failed to login');
      return false;
    }
  } catch (error) {
    console.error('Error during login operation:', error);
    return false;
  }
};



// Incluir a chamada de verifyToken no PrivateRoute ou de maneira apropriada

  

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout,
       
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
