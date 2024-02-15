import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserTable, { User } from '../../../components/user-table/UserTable';
import './GuerraToolUsers.css';
import SearchBarUsersGuerraTool from '../../../components/search-components/SearchBarUsersGuerraTool';
import MainNavbar from '../../../components/main-navbar/MainNavbar';


function GuerraToolUserCreditsPopup({
    user,
    onClose,
    onUpdateUserCredit,
  }: {
    user: User;
    onClose: () => void;
    onUpdateUserCredit: (userId: string, newCredit: number) => void;
  }) {
    const [amount, setAmount] = useState<string>('');
    //const [users, setUsers] = useState<User[]>([]);
  
    const apiurl = `https://gdcompanion-prod.onrender.com`;
  
    // Supondo que User tenha um campo credit e user_id
    // useEffect para buscar dados do usuário não modificado
    // const updateCreditForUser = (userId: string, newCredit: number) => {
    //   setUsers(users.map(user => {
    //     if (user.user_id === userId) {
    //       return { ...user, credit: newCredit };
    //     }
    //     return user;
    //   }));
    // };
    
  
    const handleManageCredits = async (operation: 'add' | 'subtract') => {
      try {
        const response = await axios.put(`${apiurl}/manage-credits-guerratool/${user.user_id}`, {
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
          <button className="credit-popup-button" onClick={onClose}>Fechar</button>
        </div>
      </>
    );
  }

export default function GuerraToolUsers() {
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

  const onUpdateUserCredit = (userId: string, newCredit: number) => {
    // Atualiza o array de usuários
    const updatedUsers = users.map(user => 
      user.user_id === userId ? { ...user, credit: newCredit } : user);
    setUsers(updatedUsers);
  
    // Atualiza o usuário selecionado, se aplicável
    if (selectedUser && selectedUser.user_id === userId) {
      setSelectedUser({ ...selectedUser, credit: newCredit });
    }
  };

  const fetchAndUpdateUsers = async () => {
    const endpoint = `${apiurldev}/users-with-pagination-guerratool?page=${currentPage}&limit=${itemsPerPage}`;
    try {
      setIsLoading(true);
      const response = await fetch(endpoint);
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
    fetchAndUpdateUsers();
  }, [currentPage, itemsPerPage]);

  const toggleResellerStatus = async (userId: number) => {
    try {
      const response = await fetch(`${apiurldev}/users/${userId}/toggle-reseller`, { method: 'PUT' });
      if (!response.ok) {
        throw new Error('Falha ao atualizar o status de revendedor');
      }
      await fetchAndUpdateUsers();
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
    navigate('/dashboard');
  };

  const prints = async () => {
    navigate('/get-prints-themagictool')
  }

  const targets = async () => {
    navigate('/target')
  }

  const usersTheMagicTool = async () => {
    navigate('/users')
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
        <GuerraToolUserCreditsPopup
        key={selectedUser.user_id + creditUpdateTrigger} // Isso força a re-renderização com novos dados
        user={selectedUser}
        onClose={handleClosePopup}
        onUpdateUserCredit={onUpdateUserCredit} 
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
    <div>
      <MainNavbar/>
      <br />   <br />   <br />   <br />   <br />  
      <h2 className='title-table'>Todos os Usuários em GUERRATOOL</h2>
      <button onClick={usersTheMagicTool}>Checar usuários no The Magic Tool</button>
      <div>
        <SearchBarUsersGuerraTool/>
  
      </div>
      <br />
      {renderContent()}
      <br />
      <div style={{ display: "flex", flexDirection: "row"}}>
        <button className="button" onClick={prints}  >Prints</button>
        <button className="button" onClick={targets}  >Targets</button>
      </div>
        
        <button  onClick={backToDashboard}>Voltar ao Início</button>
    </div>
  );
}
