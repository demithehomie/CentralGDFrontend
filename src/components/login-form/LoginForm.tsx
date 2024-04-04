import  { useState } from 'react';
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

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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
         Launch
        </Button>

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
