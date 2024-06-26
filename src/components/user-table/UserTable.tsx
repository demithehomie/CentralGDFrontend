
import styled from 'styled-components';

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

const TableContainer = styled.div`
    overflow-x: auto;
    max-width: 200%;
    border-radius: 30px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #000000;
    margin-bottom: 20px;

`;

const TableRow = styled.tr`
    background-color: #565656;

    &:nth-child(even) {
        background-color: #878787;
    }
`;

const TableHeader = styled.th`
    background-color: #333;
    color: #ffffff;
    padding: 10px;
    text-align: center;
`;

const TableCell = styled.td`
    padding: 8px 10px;
    border: 1px solid #ddd;
    color: #ffffff;
    white-space: nowrap;
`;

export type UserTableProps = {
    users: User[];
    onToggleResellerStatus: (userId: number) => Promise<void>;
    onUserClick: (user: User) => void; // Adicione essa prop
};

const UserTable: React.FC<UserTableProps> = ({ users, onToggleResellerStatus, onUserClick }) => {
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
                    {users.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell onClick={() => onUserClick(user)}>{user.name}</TableCell>
                          <TableCell onClick={() => onUserClick(user)}>{user.username}</TableCell>
                     
                            <TableCell onClick={() => onUserClick(user)} >{user.credit}</TableCell>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={user.is_reseller === 1}
                                    onChange={() => onToggleResellerStatus(user.user_id)}
                                />
                            </TableCell>
                            <TableCell
                                onClick={() => onUserClick(user)}
                                style={{
                                    backgroundColor: user.user_status === 'on' ? 'green' : 'red',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            >
                                {user.user_status === 'on' ? 'ATIVO' : 'BLOQUEADO'}
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;
