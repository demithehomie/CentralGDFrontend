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

 // Função para buscar as solicitações de captura de tela
const fetchRequests = async (signal: any) => {
  try {
      const response = await axios.get(`${apiURL}/get-all-screenshot-requests`, { signal });
      setRequests(response.data);
  } catch (error) {
      console.error('Erro ao buscar os dados', error);
  }
};

useEffect(() => { // DONE
  // Cria um novo AbortController para a solicitação
  const abortController = new AbortController();
  const signal = abortController.signal;

  // Execute a função para buscar as solicitações de captura de tela
  fetchRequests(signal);

  // Retorna uma função de limpeza para cancelar a solicitação se o componente for desmontado
  return () => {
      abortController.abort();
  };
}, []); // Execute o efeito apenas uma vez, quando o componente for montado


const handleCreate = async () => {
  try {
      // Cria um novo AbortController para a solicitação
      const abortController = new AbortController();
      const signal = abortController.signal;

      await axios.post(`${apiURL}/create-screenshot-request`, { target: newTarget }, { signal }); // Adicione o argumento 'signal' aqui

      // Execute a função para buscar as solicitações de captura de tela
      fetchRequests(signal);

      setNewTarget('');
  } catch (error) {
      console.error('Erro ao criar', error);
  }
};

const handleUpdate = async (id: number) => {
  const targetToUpdate = editTargets[id]; // Usar a variável correta
  try {
      // Cria um novo AbortController para a solicitação
      const abortController = new AbortController();
      const signal = abortController.signal;

      await axios.put(`${apiURL}/update-screenshot-request/${id}`, { target: targetToUpdate }, { signal }); // Adicione o argumento 'signal' aqui

      // Execute a função para buscar as solicitações de captura de tela
      fetchRequests(signal);
  } catch (error) {
      console.error('Erro ao atualizar', error);
  }
};

const handleDelete = async (id: number) => {
  try {
      // Cria um novo AbortController para a solicitação
      const abortController = new AbortController();
      const signal = abortController.signal;

      await axios.delete(`${apiURL}/delete-screenshot-request/${id}`, { signal }); // Adicione o argumento 'signal' aqui

      // Execute a função para buscar as solicitações de captura de tela
      fetchRequests(signal);
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
        <td style={{ color: "#000000", fontWeight: "bold"}} title={request.target} onClick={() => copyToClipboard(request.target)}>{request.target}</td>
        <td>
          <input
          style={{ color: "#000000", fontWeight: "bold"}}
            value={editTargets[request.id] || ''}
            onChange={(e) => handleEditChange(request.id, e.target.value)}
            placeholder="Editar Target"
          />
          <button  onClick={() => handleUpdate(request.id)}>Editar</button>
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
