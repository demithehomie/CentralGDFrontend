import { useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import './MotorolaServerScreen.css';
import Swal from 'sweetalert2';
// import { set } from 'date-fns';
import { Table, Tag } from 'antd';


export default function MotorolaServerScreen() {

  const [credits, setCredits] = useState('');
  const [server, setServerStatus] = useState('');

  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://frpbosstool-server.onrender.com/api';
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  


  async function handleLogin() {
    try {
        setLoading(true); // Define o estado de carregamento como verdadeiro
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization', );
        headers.append('Content-Type', 'application/json');
        headers.append('appver', '1.0.0');
        
        const response = await fetch(apiUrl + '/login', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            user: 'guerratool',
            pass: 'GuerratoolAPIaccess!**Pass',
            hwid: 'asd880nf2832nfasd8f23fbas8fasfhwef923a9scd79'
          })
        });
        const data = await response.json(); // Extrai os dados da resposta
        setLoading(false); // Define o estado de carregamento como falso
        setServerStatus(data.server); // Atualiza o estado do servidor
        setCredits(data.credits); // Atualiza os créditos
        console.log('Login Response:', data); // Registra a resposta no console
        // Exibe uma mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Fetch Successful',
            text: 'Server status and credits retrieved successfully.'
        });
    } catch (error: any) {
        // Em caso de erro, exibe uma mensagem de erro e registra o erro no console
        setLoading(false); // Define o estado de carregamento como falso
        console.error('Error fetching server status:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching server status.'
        });
        // Verifica se há uma resposta de erro e a registra no console, se houver
        if (error.response) {
            console.log('Error response:', error.response);
        }
    }
}


const columns = [
  {
    title: 'Info',
    dataIndex: 'info',
    key: 'info',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    render: (value: string, record: { info: string; }) => {
      let tagColor = 'yellow';
      let tagText = 'FETCH';

      if (record.info === 'Server Status' && value === 'ok') {
        tagColor = 'green';
        tagText = 'OKAY';
      }

      if (record.info === 'Credits' && value) {
        tagColor = 'green';
        tagText = credits;
      }
      
      return <Tag color={tagColor}>{tagText}</Tag>;
    }
  },
];

const data = [
  {
    key: '1',
    info: 'Server Status',
    value: server,
  },
  {
    key: '2',
    info: 'Credits',
    value: credits,
  },
];



  return (
    <>
    <MainNavbar/>
    <MainNavbar />
            <div className='motorola-servers-container'>
                <h1 className='title'>GuerraTool - Servers</h1>
                <h4 className='title' style={{ fontSize: '20px'}}>Samsung Servers</h4>
         
                <div>
                    {loading && <p>Loading...</p>}
                   
                    <Table columns={columns} dataSource={data} pagination={false} />
                    <br />
                    <button onClick={handleLogin}>Fetch Data</button>
                </div>
            
            </div>
  

    </>

  )
}
