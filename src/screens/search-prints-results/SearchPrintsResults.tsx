import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../components/user-table/UserTable';
import './SearchPrintsResults.css';


const SearchPrintsResults = () => {
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
      const response = await axios.get(`npm run build
      `, {
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

  const getAllPrintsGuerraTool = async () => {
    navigate('/get-prints-guerra-tool')
  }

  const getAllPrints = async () => {
    navigate('/get-prints-themagictool')
  }

  const navigateToUserProfile = (user_id: string) => {
    // Implemente a navegação para o perfil do usuário aqui
    navigate(`/user-profile/${user_id}`);

  };

  return (
    <div>
      <h2 className='title-fonts'>Resultados da pesquisa</h2>
      {Array.isArray(results) && results.length > 0 ? (
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
        <div style={{ color: "#ffffff", margin: 30, fontSize: 25}}>
          <label style={{ color: "#ffffff"}}>
          Nenhum usuário encontrado.
          </label>
       
        </div>
      )}
      <button className="button-filled-large" onClick={getAllPrints}>Voltar a Todos os Prints - The Magic Tool</button>
      <br /><br />
      <button className="button-filled-large" onClick={getAllPrintsGuerraTool}>Voltar a Todos os Prints - GuerraTool</button>
      <br /><br />
      <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
    </div>
  );
  
};


export default SearchPrintsResults;