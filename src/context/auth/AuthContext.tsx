import  /*React,*/{ createContext, useState, useContext } from 'react';
import axios from 'axios';

interface User {
    username: string | null;
  }
  

interface AuthContextType {
  currentUser: any;  // Substitua 'any' pelo tipo apropriado
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {}
});


export const useAuth = () => useContext(AuthContext);

const apiurldev = `https://gdcompanion-prod.onrender.com`;

//const apiurl = `https://gdcompanion-prod.onrender.com`

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
   // const [isLoading, setIsLoading] = useState(false);

// No seu contexto de autenticação
const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${apiurldev}/login-individual`, {
        username,
        password,
      });
      if (response.status === 200) {
        setCurrentUser({ username: username });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro de login", error);
      return false;
    }
  };
  
  

    const logout = () => {
        // Lógica de logout
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
