import  { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoo.png'; // Substitua pelo caminho correto do seu logo
import { useAuth } from '../../context/auth/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #302F50;
`;

const Logo = styled.img`
  margin-bottom: 20px;
  position: absolute;
  max-width: 15%;
  min-width: 150px;
  margin-top: -350px;
`;

const Input = styled.input`
  outline: none;
  border: 2px solid white;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: -60px;
  background-color: transparent;
  color: white;
  position: absolute;

  ::placeholder {
    color: white;
  }
`;

const InputPassword = styled.input`
  outline: none;
  border: 2px solid white;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: -40px;
  background-color: transparent;
  color: white;
  position: absolute;

  ::placeholder {
    color: white;
  }
`;

const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 205px;
  position: absolute;
  margin-top: 180px;
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  
  position: absolute;
  margin-top: 290px;
`;

const Message = styled.p`
  color: white;
  padding: 9px;
  background-color: red;
  border-radius: 19px;
  margin-top: 400px;
`;

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, ] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let timer: number | undefined;

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await login(username, password);
        console.log(response);
        navigate('/dashboard');
    } catch (error) {
        console.error('Erro no login:', error);
    } finally {
        setIsLoading(false);
    }
};


  const handleMouseEnter = () => {
      setShowPassword(true);
      setShowMessage(true);
      clearTimeout(timer);
      timer = window.setTimeout(() => {
          setShowPassword(false);
          setShowMessage(false);
      }, 25000); // 25 segundos
  };

  const handleMouseLeave = () => {
      setShowPassword(false);
      setShowMessage(false);
      clearTimeout(timer);
  };

  useEffect(() => {
      return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
      if (isLoading) {
          return (
              <center>
                     <br />
                    <div className="loader"></div> 
                    <h3 className='loading-messages'>Carregando usuarios..</h3>
                    <br /><br />
              </center>
          );
      }

      if (error) {
          return <p className="error-message">Ocorreu um erro: {error}</p>;
      }

      // Retorne null ou outro conteúdo se não estiver carregando e não houver erros
      return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoginContainer>
        
      <Logo src={logo} alt="Logo" />
      <Input
        type="text"
        placeholder="Login"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br /><br />
      <InputPassword
        type={showPassword ? 'text' : 'password'}
        placeholder="Senha"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onChange={(e) => setPassword(e.target.value)}
        style={{marginTop:50}}
      />
    
      <Button type="submit">Login</Button>
      <OutlineButton>Cadastro</OutlineButton>
      {showMessage && (
        <Message>To hide the password, please put the cursor outside the input.</Message>
      )}
       
        {renderContent()}
      
    </LoginContainer>
  </form>
  );
};

export default LoginForm;
