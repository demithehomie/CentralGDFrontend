import  { useState, useEffect } from 'react';
import axios from 'axios';
import './MiniTargettable.css';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../main-navbar/MainNavbar';

interface ScreenShotRequest {
    id: number;
    target: string;
    created_at: string;
    updated_at: string; 
}

const MiniTargetTable = () => {
    const navigate = useNavigate();
  const apiURL = 'https://gdcompanion-prod.onrender.com';
  const [requests, setRequests] = useState<ScreenShotRequest[]>([]); // Tipagem aqui
  const [newTarget, setNewTarget] = useState('');
  const [editTargets, setEditTargets] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${apiURL}/get-all-screenshot-requests`);
      setRequests(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${apiURL}/create-screenshot-request`, { target: newTarget });
      fetchRequests();
      setNewTarget('');
    } catch (error) {
      console.error('Erro ao criar', error);
    }
  };

  const handleUpdate = async (id: number) => {
    const targetToUpdate = editTargets[id]; // Usar a variável correta
    try {
      await axios.put(`${apiURL}/update-screenshot-request/${id}`, { target: targetToUpdate });
      fetchRequests();
    } catch (error) {
      console.error('Erro ao atualizar', error);
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiURL}/delete-screenshot-request/${id}`);
      fetchRequests();
    } catch (error) {
      console.error('Erro ao deletar', error);
    }
  };

  const handleEditChange = (id: number, value: string) => {
    setEditTargets(prev => ({ ...prev, [id]: value }));
  };

  const backToDashboard = () => {
    navigate('/familiaguerra/all-new-dashboard');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Mostra uma mensagem ou faz algo para indicar que o texto foi copiado
      alert("Texto copiado para a área de transferência!");
    }, (err) => {
      console.error('Erro ao copiar texto: ', err);
    });
  };

  return (
    <>
     <MainNavbar/>
   
    <div className="miniTargetTable">
    <br /><br /><br /><br /><br />    <br /><br /><br /><br />
        <h3 style={{ color: '#ffffff'}}>Inserir Alvo</h3>
      <div>
        <input
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="Novo Target"
        />
        <button onClick={handleCreate}>Criar</button>
        <br /><br />
      </div>
      <ul >
      <table className="requestsTable">
  <thead>
    <tr>
      <th>Target</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {requests.map((request) => (
      <tr key={request.id}>
        <td title={request.target} onClick={() => copyToClipboard(request.target)}>{request.target}</td>
        <td>
          <input
            value={editTargets[request.id] || ''}
            onChange={(e) => handleEditChange(request.id, e.target.value)}
            placeholder="Editar Target"
          />
          <button onClick={() => handleUpdate(request.id)}>Editar</button>
          <button onClick={() => handleDelete(request.id)}>Deletar</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </ul>
      <br /><br />
      <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
    </div>
    </>
  );
};

export default MiniTargetTable;
