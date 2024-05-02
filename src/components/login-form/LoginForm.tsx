import  { useState } from 'react';
import packageJson from '../../../package.json';
import {
  //Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Image,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fGuerra.png'; // Substitua pelo caminho correto do seu logo
import { useAuth } from '../../context/auth/AuthContext';
import './LoginForm.css';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const appVersion = packageJson.version;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isLoginSuccessful = await login(username, password);
      if (isLoginSuccessful) {
        navigate('/familiaguerra/all-new-dashboard'); // Redireciona em caso de sucesso
      } else {
        toast({
          title: 'Erro no login.',
          description: "Login falhou. Tente novamente.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro de login.',
        description: "Ocorreu um erro durante o login.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBetaButton = () => {
    Swal.fire({
      title: 'MANUTENÇÃO IMPORTANTE',
      html: `
  <p style="color: #000;">Estamos modificando várias partes cruciais do GD Companion, então algumas instabilidades ocorrerão nos seguintes setores</p>
  
  <ul style="color: #000;">
    <li style="text-align: left">Segurança e autenticação. Reforços extras contra possíveis ataques</li>
    <li style="text-align: left">Prints. Nova interface e prevenção  de vazamento de memória</li>
    <li style="text-align: left">Página de Pagamentos completamente nova.</li>
    <li style="text-align: left">Task Logs e Credit Logs com camadas extras de segurança.</li>
  </ul>
  <p style="color: #000;">Obrigado pela compreensão</p>
  <p style="color: #000;">Família Guerra (C) 2024.</p>
  `,
      icon: 'info',
      confirmButtonText: 'Close'
    });

  }

  return (
    <Center height="100vh" bg="#302F50">
         {/* <Image src={logo} alt="Logo" boxSize="190px" objectFit="cover" /> */}
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        
      <Image 
          src={logo} 
          alt="Logo" 
          maxW="20%" // Garante que a largura da imagem não exceda o container
          height="auto" // Altura automática para manter a proporção
          objectFit="contain" // Ajusta a imagem para ser contida dentro do elemento de forma proporcional
        />
        <br />

        <FormControl isRequired>
          <FormLabel htmlFor="login" color="white">Login</FormLabel>
          <Input
            id="login"
            placeholder="Digite seu login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            bg="white"
            className='input-login'
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="password" color="white">Senha</FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="white"
              className='input-password'
            />
            <InputRightElement>
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" isLoading={isLoading} type="submit">
         INICIAR
        </Button>

        <br /><br /><br />

        <button style={{
          backgroundColor: "green",
          color: '#ffffff',
          padding: 15,
          borderRadius: 30,
          boxShadow: "0 0 10px #000000",  
        }}
        
        onClick={handleBetaButton}
        
        >Versão BETA {appVersion} </button>

        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
      </VStack>
    </Center>
  );
};

export default LoginForm;
