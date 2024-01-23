import  /*React,*/{ createContext, useState, useContext } from 'react';
import axios from 'axios';

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

const apiurldev = `http://localhost:3001`;

//const apiurl = `http://localhost:3001`

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState(null);
   // const [isLoading, setIsLoading] = useState(false);
    
    const login = (username: string, password: string): Promise<any> => {
    // Note que estamos retornando a chamada axios diretamente, que retorna uma Promise
    return axios.post(`${apiurldev}/login`, {
        username,
        password,
    });
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
