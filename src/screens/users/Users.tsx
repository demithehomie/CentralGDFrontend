import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable, { User } from '../../components/user-table/UserTable';
import './Users.css';
import SearchBar from '../../components/search-components/SearchBar';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const apiurldev = `http://localhost:3001`;

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

  const renderContent = () => {
    if (isLoading) {
      return <center><div className="loader"></div><h3 className='loading-messages'>Carregando usuários..</h3></center>;
    }
    if (error) {
      return <p className="error-message">Ocorreu um erro: {error}</p>;
    }
    return (
      <>
        <UserTable users={users} onToggleResellerStatus={toggleResellerStatus} />
        <div className="pagination">
          <button className='title-table-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
          <span>Página {currentPage}</span>
          <button className='title-table-black' onClick={() => handlePageChange(currentPage + 1)}>Próxima</button>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2 className='title-table'>Todos os Usuários</h2>
      <div>
        <SearchBar/>
      </div>
      <br />
      {renderContent()}
      <br />
      <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
    </div>
  );
}
