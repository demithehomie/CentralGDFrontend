import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable, { User } from '../../../components/user-table/UserTable';
import './GuerraToolUsers.css';
import SearchBarUsersGuerraTool from '../../../components/search-components/SearchBarUsersGuerraTool';
import MainNavbar from '../../../components/main-navbar/MainNavbar';


function GuerraToolUserCreditsPopup(
  { 
    user, onClose, onAddCredits, onSubtractCredits,  onInsertCredits 
  } : { 
    user: User, onClose: () => void, 
    onAddCredits: (user: User, amount: number) => void, 
    onSubtractCredits: (user: User, amount: number) => void, 
    onInsertCredits: (user: User, amount: string) => void 
  }) {

  const [amount, setAmount] = useState('');

  return (
    <>
    <div className="background-overlay"></div>
    <div className="credit-popup-container">
      <h2 className="credit-popup-title">Gerenciar Créditos: {user.name}</h2>
      <div>
        <button onClick={() => onAddCredits(user, 1)}>+</button>
        <button onClick={() => onSubtractCredits(user, 1)}>-</button>
        <input type="number" className="popup-input" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={() => onInsertCredits(user, amount)}>Inserir</button>
      </div>
      <br />
      <button className="credit-popup-button" onClick={onClose}>Fechar</button>
      <br /><br />
      <div className="gradient-line"></div>
    <div className="copyright-text">(C) 2024 Família Guerra Software</div>
    </div>
   
    </>
  );
}

export default function GuerraToolUsers() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const handleAddCredits = async (user: User, amount: any) => {
    // Implemente a lógica para adicionar créditos aqui
    console.log(`Adicionando ${amount} créditos para ${user.name}`);
    handleClosePopup();
  };
  
  const handleSubtractCredits = async (user: User, amount: any) => {
    // Implemente a lógica para subtrair créditos aqui
    console.log(`Subtraindo ${amount} créditos de ${user.name}`);
    handleClosePopup();
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
          user={selectedUser}
          onClose={handleClosePopup}
          onAddCredits={handleAddCredits}
          onSubtractCredits={handleSubtractCredits}
          onInsertCredits={handleAddCredits}
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
