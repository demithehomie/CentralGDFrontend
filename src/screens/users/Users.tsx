import  { useState, useEffect } from 'react';
import { useNavigate, /*useParams*/ } from 'react-router-dom';
import axios from 'axios';
import UserTable, { User } from '../../components/user-table/UserTable';
import './Users.css';
import SearchBar from '../../components/search-components/SearchBar';
import MainNavbar from '../../components/main-navbar/MainNavbar';

// interface UserCreditsPopupProps {
//   user: User;
//   onClose: () => void;
//   onUpdateUserCredit: (userId: string, newCredit: number) => void;
// }



function UserCreditsPopup({
  user,
  onClose,
  onUpdateUserCredit,
}: {
  user: User;
  onClose: () => void;
  onUpdateUserCredit: (userId: string, newCredit: number, newUserStatus?: 'on' | 'blocked') => void;

}) {
  const [amount, setAmount] = useState<string>('');
  const [userStatus, setUserStatus] = useState(user.user_status);
  //const [users, setUsers] = useState<User[]>([]);

  const apiurl = `https://gdcompanion-prod.onrender.com`;

  useEffect(() => {
    // Supondo que o status esteja sendo passado corretamente na prop user
    setUserStatus(user.user_status);
  }, [user]);

  const toggleUserStatus = async () => {
    try {
      const response = await axios.put(`${apiurl}/block-unblock-users/${user.user_id}`);
      if (response.status === 200) {
        const updatedStatus = userStatus === 'on' ? 'blocked' : 'on';
        setUserStatus(updatedStatus);
        // Atualiza o status no componente pai também, se necessário
        onUpdateUserCredit(user.user_id, user.credit, updatedStatus); // Supondo que essa função também possa atualizar o status
      }
    } catch (error) {
      console.error("Erro ao alternar status do usuário", error);
    }
  };
  
  

  const handleManageCredits = async (operation: 'add' | 'subtract') => {
    try {
      const response = await axios.put(`${apiurl}/manage-credits/${user.user_id}`, {
        amount: amount,
        operation: operation,
      });
      console.log(response.data);
      // Atualize os créditos do usuário após a operação bem-sucedida
      const newCredit = operation === 'add' ? user.credit + parseFloat(amount) : user.credit - parseFloat(amount);
      onUpdateUserCredit(user.user_id, newCredit); // Corrigido aqui
    } catch (error) {
      console.error(error);
    }
  };
  


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, operation: 'add' | 'subtract') => {
    e.preventDefault(); // Previne o recarregamento da página
    handleManageCredits(operation);
  };

  return (
    <>
      <div className="background-overlay"></div>
      <div className="credit-popup-container">
        <h2 className="credit-popup-title">Gerenciar Créditos: {user.name}</h2>
        <div>
          <p className='title-color'>
            <b>Total de Créditos:</b> {user && user.credit}
          </p>
        </div>
        <form onSubmit={(e) => handleSubmit(e, 'add')}>
          <label className='title-color'>
            Quantidade: <br />
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </label>
          <div>
            <button type="submit">Adicionar</button>
            <button type="button" onClick={(e) => handleSubmit(e as any, 'subtract')}>Subtrair</button>
          </div>
        </form>
        <br />
       
        <hr />
      
        <p style={{
          color: userStatus === 'on' ? 'green' : 'red',
          fontWeight: 'bold',
        }}>
          {userStatus === 'on' ? 'O usuário está Ativo' : 'O usuário está Bloqueado'} 

       </p>

        <button style={{
          backgroundColor: userStatus === 'on' ? 'red' : 'green',
          fontWeight: 'bold',
          color: userStatus === 'on' ? 'white' : 'white',
        }} onClick={toggleUserStatus}>
          {userStatus === 'on' ? 'Bloquear' : 'Desbloquear'}
        </button>

        <hr />
        <button className="credit-popup-button" onClick={onClose}>Fechar</button>

      </div>
    </>
  );
}

//export default UserCreditsPopup;

export default function Users() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditUpdateTrigger, /*setCreditUpdateTrigger*/] = useState(0); // Inicializa um contador ou timestamp

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const apiurldev = `https://gdcompanion-prod.onrender.com`;

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowPopup(true);
  };
  

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  // const handleAddCredits = async (user: User, amount: any) => {
  //   // Implemente a lógica para adicionar créditos aqui
  //   console.log(`Adicionando ${amount} créditos para ${user.name}`);
  //   handleClosePopup();
  // };
  
  // const handleSubtractCredits = async (user: User, amount: any) => {
  //   // Implemente a lógica para subtrair créditos aqui
  //   console.log(`Subtraindo ${amount} créditos de ${user.name}`);
  //   handleClosePopup();
  // };
  const onUpdateUserCredit = (userId: string, newCredit: number, newUserStatus?: 'on' | 'blocked') => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.user_id === userId ? { ...user, credit: newCredit, user_status: newUserStatus ?? user.user_status } : user
      )
    );
  
    if (selectedUser && selectedUser.user_id === userId) {
      setSelectedUser(prevSelectedUser => {
        if (prevSelectedUser === null) return null; // Ou retornar um valor padrão para User se apropriado
        return {
          ...prevSelectedUser,
          credit: newCredit,
          user_status: newUserStatus ?? prevSelectedUser.user_status,
          // Garanta que todas as propriedades obrigatórias estejam presentes
          user_id: prevSelectedUser.user_id, // Agora não é mais opcional
          // Adicione outras propriedades obrigatórias aqui, conforme necessário
        };
      });
    }
    
  };
  
  const getToken = () => {
    return localStorage.getItem('token'); // Obtém o token do localStorage
  };
  

  const fetchAndUpdateUsers = async (currentPage: any, itemsPerPage: any, setUsers: any, setIsLoading: any, setError: any, _controller: any) => {
    const endpoint = `${apiurldev}/themagictool/users-with-pagination?page=${currentPage}&limit=${itemsPerPage}`;
    try {
      setIsLoading(true);
      const token = getToken(); // Obtendo o token de autenticação
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
       // signal: controller.signal // Passando o sinal do AbortController para o fetch
      });
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.statusText);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
   const controller = new AbortController();
  
    fetchAndUpdateUsers(currentPage, itemsPerPage, setUsers, setIsLoading, setError, controller);
  
    // return () => {
    //   controller.abort();
    // };
  }, [currentPage, itemsPerPage]);
  

  const toggleResellerStatus = async (userId: number) => {
    try {
      const controller = new AbortController();
      const trytheresponse = await fetch(`${apiurldev}/themagictool/users/${userId}/toggle-reseller`, { method: 'PUT' });
      const token = getToken(); // Obtendo o token de autenticação
      const response = await fetch(trytheresponse.url, { // Usar trytheresponse.url para obter o URL correto
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal // Passando o sinal do AbortController para o fetch
      });
  
      if (!response.ok) {
        throw new Error('Falha ao atualizar o status de revendedor');
      }
      // Passa os argumentos necessários para fetchAndUpdateUsers
      await fetchAndUpdateUsers(currentPage, itemsPerPage, setUsers, setIsLoading, setError, controller);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const backToDashboard = () => {
    navigate('/familiaguerra/all-new-dashboard');
  };

  const prints = async () => {
    navigate('/themagictool/new-screen/get-all-prints')
  }

  const printsSemId = async () => {
    navigate('/withoutid/user-prints-page')
  }

  const usersGuerraTool = async () => {
    navigate('/guerratool-users')
  }

  const targets = async () => {
    navigate('/target')
  }

  const blockedUsers = async () => {
    navigate('/blocked-users')
  }

  const theMagicToolTaskLogs = async () => {
    navigate('/tmt-task-logs')
  }

  const navigateToTMTCreditLogs = () => {
    navigate('/tmt-credit-logs');
  }

  const fingerprintHistory = () => {
    navigate('/themagictool/fingerprints-history')
  }

  const renderContent = () => {
    if (isLoading) {
      return <center><div className="loader"></div><h3 className='loading-messages'>Carregando usuários..</h3></center>;
    }
    if (error) {
      return <p className="error-message">Ocorreu um erro: {error}</p>;
    }
    return (
      <>
        <UserTable users={users} onToggleResellerStatus={toggleResellerStatus} onUserClick={handleUserClick}/>
        {showPopup && selectedUser && (
        <UserCreditsPopup
        key={selectedUser.user_id + creditUpdateTrigger} // Isso força a re-renderização com novos dados
          user={selectedUser}
          onClose={handleClosePopup}
          onUpdateUserCredit={onUpdateUserCredit} 
         // onUpdateUserCredit={updateCreditForUser}
          // onAddCredits={handleAddCredits}
          // onSubtractCredits={handleSubtractCredits}
          // onInsertCredits={handleAddCredits}
        />
      )}
        <div className="pagination">
          <button className='title-table-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
          <span style={{ color: '#ffffff'}}>Página {currentPage}</span>
          <button className='title-table-black' onClick={() => handlePageChange(currentPage + 1)}>Próxima</button>
        </div>
      </>
    );
  };

  return (
    <>
    <MainNavbar/>
    <div>
      <br /><br /> <br /><br /> <br /><br /> 
      <h2 className='title-table'>Todos os Usuários em The Magic Tool</h2> 
      <button onClick={usersGuerraTool}>Checar usuários no GuerraTool</button>
      <div>
        <SearchBar/>
  
      </div>
      <br />
      {renderContent()}
      <br />
      <div style={{ display: "flex", flexDirection: "row"}}>
        <button className="button" onClick={prints}  >Prints</button>
        <button className="button" onClick={printsSemId}  >Prints sem User ID</button>
        <button className="button" onClick={targets}  >Targets</button>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column"}}>
      <button onClick={fingerprintHistory}>Histórico de Fingerprints</button>
      <button onClick={theMagicToolTaskLogs}>Task Logs</button>
        <button onClick={navigateToTMTCreditLogs}>Credit Logs</button>
        <button className="danger" onClick={blockedUsers}>Usuários Bloqueados</button>
        <button  onClick={backToDashboard}>Voltar ao Início</button>
      </div>
      
    </div>
    </>
  );
}
