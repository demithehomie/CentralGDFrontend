import React, {  useState } from 'react';
import { useLocation } from 'react-router-dom';

import './BlockedUserTable.css';
import styled, { css } from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface TableCellProps {
  isReseller?: boolean;
  isDistributor?: boolean;
}

const TableContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #000000;
  margin-bottom: 20px;
`;

const TableRow = styled.tr`
  background-color: #f2f2f2;

  &:nth-child(even) {
    background-color: #ffffff;
  }
`;

const TableHeader = styled.th`
  background-color: #333;
  color: #ffffff;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td<TableCellProps>`
  padding: 8px 10px;
  border: 1px solid #ddd;
  color: #000000;
  white-space: nowrap;

  ${(props) =>
    props.isReseller
      ? css`
          background-color: lightblue; /* Fundo azul claro para 'Sim' */
          color: black; /* Fonte preta */
        `
      : props.isDistributor
      ? css`
          background-color: darkgreen; /* Fundo verde escuro para 'Não' */
          color: white; /* Fonte branca */
        `
      : ``}
`;

// Utilizando o mesmo tipo User para a propriedade users
export interface User {
  user_id: any;
  profilePicture: string;
  name: string;
  username: string;
  credit: number;
  is_reseller: number;
  is_distributor: number;
  email: string;
  user_status: 'on' | 'blocked';
}

interface BlockedUsersTableProps {
    users: User[];
    onToggleResellerStatus: (userId: number) => Promise<void>;
    onUserClick: (user: User) => void;
  }
  
  const BlockedUsersTable: React.FC<BlockedUsersTableProps> = ({ users, /*onToggleResellerStatus, onUserClick*/ }) => {

    const location = useLocation();


    const [ /*users*/, setUsers] = useState<User[]>([]);

    const apiurl = `https://gdcompanion-prod.onrender.com`;

    const onToggleResellerStatus = async (userId: number) => {
      // Implemente a chamada ao seu endpoint aqui, exemplo:
      const response = await fetch(`${apiurl}/themagictool/toggle-reseller/${userId}`, {
        method: 'PUT', // ou 'POST', dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error('Falha ao alternar status do reseller');
      }
    
      // Atualize o estado local/global conforme necessário
      // Por exemplo, recarregar os usuários ou atualizar o estado diretamente
    };

    const onToggleResellerStatusAtGuerraTool = async (userId: number) => {
      // Implemente a chamada ao seu endpoint aqui, exemplo:
      const response = await fetch(`${apiurl}/guerratool/toggle-reseller/${userId}`, {
        method: 'PUT', // ou 'POST', dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error('Falha ao alternar status do reseller');
      }
    
 
    };

    const onToggleDiatributorStatus = async (userId: number) => {
      // Implemente a chamada ao seu endpoint aqui, exemplo:
      const response = await fetch(`${apiurl}/themagictool/toggle-reseller/${userId}`, {
        method: 'PUT', // ou 'POST', dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error('Falha ao alternar status do reseller');
      }
    
      // Atualize o estado local/global conforme necessário
      // Por exemplo, recarregar os usuários ou atualizar o estado diretamente
    };

    const onToggleDistributorStatusAtGuerraTool = async (userId: number) => {
      // Implemente a chamada ao seu endpoint aqui, exemplo:
      const response = await fetch(`${apiurl}/guerratool/toggle-distributor/${userId}`, {
        method: 'PUT', // ou 'POST', dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error('Falha ao alternar status do reseller');
      }
    
 
    };


    // Implemente handleUserClickToggleResellerToggleReseller
    const handleUserClickToggleReseller = async (user: User) => {
      const result = await MySwal.fire({
        title: `Alterar status de reseller para o usuário ${user.username}`,
        text: `Status atual: ${user.is_reseller ? 'Reseller' : 'Não é Reseller'}`,
        showCancelButton: true,
        confirmButtonText: 'Alterar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          // Verifica o pathname para decidir qual função chamar
          if (location.pathname.includes('/guerratool')) {
            return onToggleResellerStatusAtGuerraTool(user.user_id)
              .catch(error => {
                // Captura o erro e exibe um alerta de erro
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          } else {
            return onToggleResellerStatus(user.user_id)
              .catch(error => {
                // Captura o erro e exibe um alerta de erro
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });
    
      if (result.isConfirmed && result.value) {
        // A lógica para atualizar o estado local dos usuários, se necessário
        setUsers(users.map(u => {
          if (u.user_id === user.user_id) {
            return { ...u, is_reseller: u.is_reseller ? 0 : 1 };
          }
          return u;
        }));
        MySwal.fire('Atualizado!', 'O status do usuário foi atualizado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire('Cancelado', 'A operação foi cancelada', 'error');
      }
    };
    

    // const loadUsers = async () => {
    //   try {
    //     const response = await fetch(`${apiurl}/users/blocked`);
    //     if (!response.ok) {
    //       throw new Error('Erro ao buscar usuários bloqueados');
    //     }
    //     const data = await response.json();
    //     setUsers(data);
    //   } catch (error) {
    //     console.error("Falha ao buscar usuários bloqueados:", error);
    //   }
    // };
    
   

    const handleUserClickToggleDistributor = async (user: User) => {
      const result = await MySwal.fire({
        title: `Alterar status de Distribuidor para o usuário ${user.username}`,
        text: `Status atual: ${user.is_distributor ? 'Distribuidor' : 'Não é Distribuidor'}`,
        showCancelButton: true,
        confirmButtonText: 'Alterar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          // Verifica o pathname para decidir qual função chamar
          if (location.pathname.includes('/guerratool')) {
            return onToggleDistributorStatusAtGuerraTool(user.user_id)
              .catch(error => {
                // Captura o erro e exibe um alerta de erro
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          } else {
            return onToggleDiatributorStatus(user.user_id)
              .catch(error => {
                // Captura o erro e exibe um alerta de erro
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });
    
      if (result.isConfirmed && result.value) {
        // A lógica para atualizar o estado local dos usuários, se necessário
        setUsers(users.map(u => {
          if (u.user_id === user.user_id) {
            return { ...u, is_distributor: u.is_distributor ? 0 : 1 };
          }
          return u;
        }));
        MySwal.fire('Atualizado!', 'O status do usuário foi atualizado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire('Cancelado', 'A operação foi cancelada', 'error');
      }
    };

      

    return (
      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Nome</TableHeader>
              <TableHeader>Nome de Usuário</TableHeader>
              <TableHeader>Créditos</TableHeader>
              <TableHeader>Reseller</TableHeader>
              <TableHeader>Distributor</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {users.map(user => (
              <TableRow key={user.user_id} >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.credit}</TableCell>
                <TableCell onClick={() => handleUserClickToggleReseller(user)} isReseller={user.is_reseller === 1}>{user.is_reseller ? 'Sim' : 'Não'}</TableCell>
                <TableCell  onClick={() => handleUserClickToggleDistributor(user)} isDistributor={user.is_distributor === 1}>{user.is_distributor ? 'Sim' : 'Não'}</TableCell>
                <TableCell
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  BLOCKED
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  };
  
  export default BlockedUsersTable;
  