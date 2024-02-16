import React, { useEffect, useState } from 'react';
import './BlockedUserTable.css';
import styled from 'styled-components';

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

const TableCell = styled.td`
  padding: 8px 10px;
  border: 1px solid #ddd;
  color: #000000;
  white-space: nowrap;
`;

// Utilizando o mesmo tipo User para a propriedade users
export interface User {
  user_id: any;
  profilePicture: string;
  name: string;
  username: string;
  credit: number;
  is_reseller: number;
  email: string;
  user_status: 'on' | 'blocked';
}

interface BlockedUsersTableProps {
    users: User[];
    onToggleResellerStatus: (userId: number) => Promise<void>;
    onUserClick: (user: User) => void;
  }
  
  const BlockedUsersTable: React.FC<BlockedUsersTableProps> = ({ users, /*onToggleResellerStatus, onUserClick*/ }) => {

    const [ /*users*/, setUsers] = useState<User[]>([]);

    useEffect(() => {
      const fetchBlockedUsers = async () => {
        try {
          // Atualize para o URL correto do seu endpoint
          const response = await fetch('/users/blocked');
          if (!response.ok) {
            throw new Error('Erro ao buscar usuários bloqueados');
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Falha ao buscar usuários bloqueados:", error);
        }
      };
  
      fetchBlockedUsers();
    }, []); // O array vazio como segundo argumento significa que este efeito roda apenas uma vez após o componente montar.

    return (
      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Nome</TableHeader>
              <TableHeader>Nome de Usuário</TableHeader>
              <TableHeader>Créditos</TableHeader>
              <TableHeader>Revendedor</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {users.map(user => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.credit}</TableCell>
                <TableCell>{user.is_reseller ? 'Sim' : 'Não'}</TableCell>
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
  