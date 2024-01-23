import React from 'react';
import './UserTable.css';
import styled from 'styled-components';

export interface User {
    user_id: number;
    profilePicture: string;
    name: string;
    username: string;
    credit: number;
    is_reseller: number;
    email: string
}

interface TableRowProps {
    index: number;
}

const TableRow = styled.tr<TableRowProps>`
    background-color: ${props => props.index % 2 === 0 ? 'white' : 'gray'};
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #000000;
`;

const TableCell = styled.td`
    padding: 8px 38px;
    border: 1px solid #ddd;
    color: #000000;
`;

// const ProfileImage = styled.img`
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
// `;



export type UserTableProps = {
    users: User[];
    onToggleResellerStatus: (userId: number) => Promise<void>;
};

const UserTable: React.FC<UserTableProps> = ({ users, onToggleResellerStatus }) => {
  return (
      <Table>
          <thead className='border'>
              <tr>
                  {/* <th className='table-titles'>Foto de Perfil</th> */}
                  <th className='table-titles'>Nome</th>
                  <th className='table-titles'>Nome de Usuário</th>
                  <th className='table-titles'>Créditos</th>
                  <th className='table-titles'>Revendedor</th>
              </tr>
          </thead>
          <tbody>
              {users.map((user, index) => (
                  <TableRow key={user.user_id} index={index}>
                      {/* <TableCell><ProfileImage src={user.profilePicture} alt="Profile" /></TableCell> */}
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.credit}</TableCell>
                      <TableCell>
                          <input
                              type="checkbox"
                              checked={user.is_reseller === 1} // Aqui estamos verificando se isReseller é igual a 1
                              onChange={() => onToggleResellerStatus(user.user_id)}
                          />
                      </TableCell>
                  </TableRow>
              ))}
          </tbody>
      </Table>
  );
};
export default UserTable;
