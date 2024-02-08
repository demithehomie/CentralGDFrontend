import  { useState, useEffect } from 'react';
import { useNavigate, /*useParams*/ } from 'react-router-dom';
import axios from 'axios';
import UserTable, { User } from '../../components/user-table/UserTable';
import './Users.css';
import SearchBar from '../../components/search-components/SearchBar';
import MainNavbar from '../../components/main-navbar/MainNavbar';

function UserCreditsPopup(
  { 
    user, onClose, //onAddCredits, onSubtractCredits,  onInsertCredits 
  } : { 
    user: User, onClose: () => void, 
    onAddCredits: (user: User, amount: number) => void, 
    onSubtractCredits: (user: User, amount: number) => void, 
    onInsertCredits: (user: User, amount: string) => void 
  }) {

    const [ /*userData,*/, setUserData] = useState<User | null>(null);
 // const { userId } = useParams<{ userId: string }>();
 // const [amount, setAmount] = useState('');
  const [addAmount, setAddAmount] = useState<string>('');
  const [subtractAmount, setSubtractAmount] = useState<string>('');

  const apiurl = `https://gdcompanion-prod.onrender.com`;
  //const apiurldev = `http://localhost:3001`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://gdcompanion-prod.onrender.com/users/${user.user_id}`);
        console.log(user.user_id)
     
          setUserData(response.data);
      } catch (error) {
        console.error((error as Error).message);
      }
    };
  
    fetchUser();
  }, [user.user_id]);

  const handleAddCredits = async () => {
    try {
      const response = await axios.put(`${apiurl}/add-credits/${user.user_id}`, { amount: addAmount  });
      console.log(addAmount); // Exiba a resposta do servidor
      console.log(response.data); // Exiba a resposta do servidor
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSubtractCredits = async () => {
    try {
      const response = await axios.put(`${apiurl}/subtract-credits/${user.user_id}`, { amount: subtractAmount });
      console.log(response.data); // Exiba a resposta do servidor
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
    <div className="background-overlay"></div>
    <div className="credit-popup-container">
      <h2 className="credit-popup-title">Gerenciar Créditos: {user.name}</h2>
      {/* <div>
        <button onClick={() => onAddCredits(user, 1)}>+</button>
        <button onClick={() => onSubtractCredits(user, 1)}>-</button>
        <input type="number" className="popup-input" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={() => onInsertCredits(user, amount)}>Inserir</button>
      </div> */}
      <div>
      <div className='new-text-alignment-credit-data'>
            {/* <label className='main-title-color'>Gestão de Créditos</label> */}
            <p className='title-color'>
              <b>Total de Créditos:</b> {user && user.credit}
            </p>
         </div>
      <form onSubmit={handleAddCredits}>
                      <label className='title-color'>
                        Quantidade para Adicionar: <br />
                        <input 
                          type="number" 
                          value={addAmount} 
                          onChange={(e) => setAddAmount(e.target.value)} 
                        />
                      </label>
                    <button type="submit" >Adicionar</button>
                  </form>
      </div>
      <div>
      <form onSubmit={handleSubtractCredits}>
                    <label className='title-color'>
                      Quantidade para Subtrair: <br />
                      <input 
                        type="number" 
                        value={subtractAmount} 
                        onChange={(e) => setSubtractAmount(e.target.value)} 
                      />
                      </label>
                      <button type="submit" >Subtrair</button>
                  </form>
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

export default function Users() {
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
    const endpoint = `${apiurldev}/users-with-pagination?page=${currentPage}&limit=${itemsPerPage}`;
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

  const usersGuerraTool = async () => {
    navigate('/guerratool-users')
  }

  const targets = async () => {
    navigate('/target')
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
        <button className="button" onClick={targets}  >Targets</button>
      </div>
        
        <button  onClick={backToDashboard}>Voltar ao Início</button>
    </div>
    </>
  );
}
