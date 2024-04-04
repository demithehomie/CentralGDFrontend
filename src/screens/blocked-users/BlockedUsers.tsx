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
  const [refreshKey, setRefreshKey] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Endpoint de usuários bloqueados
  const apiurl_themagictool = `https://gdcompanion-prod.onrender.com/themagictool/users/blocked`;

  const apiurl = `https://gdcompanion-prod.onrender.com`;
  // Dentro de cada componente de página, como BlockedUsers e GuerraToolBlockedUsers

const refreshUsers = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(apiurl_themagictool);
    setUsers(response.data); // Atualiza o estado com os novos dados
    setIsLoading(false);
  } catch (err) {
    setIsLoading(false);
    if (axios.isAxiosError(err)) {
      console.error("Erro ao buscar usuários bloqueados:", err.response?.data);
      setError("Falha ao carregar usuários bloqueados.");
    }
  }
};

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

  useEffect(() => {
  

    fetchBlockedUsers();
  }, [triggerFetch]);

  const backToDashboard = () => {
    navigate('/familiaguerra/all-new-dashboard');
  };

  const navigateToGTBlockedUsers = () => {
    navigate('/blocked-users/guerratool');
  }

  // const toggleResellerStatus = async (userId: number) => {
  //   try {
  //     const response = await axios.put(`${apiurl}/themagictool/toggle-reseller/${userId}`);
  //     // Supondo que response.data contenha o usuário atualizado
  //     const updatedUser = response.data;
  
  //     // Atualiza o estado dos usuários diretamente com os dados do usuário atualizado
  //     setUsers(currentUsers => {
  //       return currentUsers.map(user => {
  //         if (user.user_id === userId) {
  //           // Assume que updatedUser contém os dados atualizados do usuário,
  //           // incluindo o novo status de reseller
  //           return { ...user, ...updatedUser };
  //         }
  //         return user;
  //       });
  //     });

  //     await refreshUsers()
  //   } catch (error) {
  //     console.error("Falha ao alternar status do reseller", error);
  //     // Aqui você pode querer tratar o erro, talvez mostrando um alerta para o usuário
  //   }
  // };
  const toggleResellerStatus = async (userId: number) => {
    try {
      await axios.put(`${apiurl}/themagictool/toggle-reseller/${userId}`);
      await refreshUsers(); // Atualiza os usuários
      setRefreshKey(prevKey => prevKey + 1); // Incrementa a chave para forçar a remontagem
      setTriggerFetch(prev => !prev);

    } catch (error) {
      console.error("Falha ao alternar status do reseller", error);
    }
  };
  

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
            key={refreshKey}
            users={users}
            onToggleResellerStatus={(userId: number) => toggleResellerStatus(userId)}
            onUserClick={() => {}}
          />
        </>
    );
  };

  return (
    <>
      <MainNavbar/>
      <div>
       
        <br /><br /> <br /><br /> <br /><br />
        <h1 style={{
          color: "#ffffff"
        }}>Locking Center</h1>
        <h2 className='title-table'>Blocked Usuários at The Magic Tool</h2>
        {/* <div>
          <SearchBar/>
        </div> */}
        <button onClick={navigateToGTBlockedUsers}>Check Blocked Usuários at GUERRATOOL</button>
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