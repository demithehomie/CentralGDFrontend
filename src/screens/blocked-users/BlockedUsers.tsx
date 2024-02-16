import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Importando BlockedUsersTable
import BlockedUsersTable from '../../components/blocked-user-table/BlockedUserTable';
import './BlockedUsers.css';
//import SearchBar from '../../components/search-components/SearchBar';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { User } from '../../components/user-table/UserTable'; // Ajuste conforme necessário

export default function BlockedUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Endpoint de usuários bloqueados
  const apiurl_themagictool = `https://gdcompanion-prod.onrender.com/themagictool/users/blocked`;

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiurl_themagictool);
        setUsers(response.data); // Certifique-se de que a resposta corresponde ao tipo esperado
        setIsLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Erro ao buscar usuários bloqueados:", err.response?.data);
          setError("Falha ao carregar usuários bloqueados.");
        }
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const backToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToGTBlockedUsers = () => {
    navigate('/blocked-users/guerratool');
  }

  const renderContent = () => {
    if (isLoading) {
        return <center><div className="loader"></div><h3 className='loading-messages'>Carregando usuários bloqueados...</h3></center>;
    }
    if (error) {
        return <p className="error-message">Ocorreu um erro: {error}</p>;
    }
    return (
        <>
            <BlockedUsersTable
              users={users}
              onToggleResellerStatus={(/*userId: number*/) => Promise.resolve()} // Ajuste conforme a interface de BlockedUsersTable
              onUserClick={() => {}} // Ajuste conforme necessário
            />
        </>
    );
  };

  return (
    <>
      <MainNavbar/>
      <div>
        <br /><br /> <br /><br /> <br /><br />
        <h2 className='title-table'>Blocked Users at The Magic Tool</h2>
        {/* <div>
          <SearchBar/>
        </div> */}
        <button onClick={navigateToGTBlockedUsers}>Check Blocked Users at GUERRATOOL</button>
        <br />
        <br />
        {renderContent()}
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={backToDashboard}>Voltar ao Início</button>
        </div>
      </div>
    </>
  );
}