import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../components/user-table/UserTable';
import './SearchResults.css';


const SearchResults = () => {
  // Tipar results como um array de User
  const navigate = useNavigate();
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('query');
    if (searchQuery) {
      fetchResults(searchQuery);
    }
  }, [location]);

  // Tipar o parâmetro query como string
  const fetchResults = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/search-users`, {
        params: { keyword: query }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      // Trate o erro conforme necessário
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const backToDashboard = () => {
    navigate('/dashboard');
  };

  const getAllUsers = async () => {
    navigate('/users')
  }

  const navigateToUserProfile = (user_id: string) => {
    // Implemente a navegação para o perfil do usuário aqui
    navigate(`/user-profile/${user_id}`);

  };

  return (
    <div>
      <h2 className='title-fonts'>Resultados da pesquisa</h2>
      {results.length > 0 ? (
        <ul className="results-list">
          {results.map((user) => (
          <li
          className='title-fonts'
          key={user.user_id}
          onClick={() => navigateToUserProfile(user.user_id.toString())}
        >
          {user.name} - {user.email}
        </li>
        
          ))}
        </ul>
      ) : (
        <div>Nenhum usuário encontrado.</div>
      )}
      <button className="button-filled-large" onClick={getAllUsers}>Voltar ao Todos os Usuários</button>
      <br /><br />
      <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
    </div>
  );
};


export default SearchResults;
