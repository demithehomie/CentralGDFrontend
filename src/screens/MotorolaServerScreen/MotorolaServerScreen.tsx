import { useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import './MotorolaServerScreen.css';
import Swal from 'sweetalert2';
// import { set } from 'date-fns';
import { 

  Table, 
  Tag, 
  Button, 
//  Input 

} from 'antd';

import { ColumnsType } from 'antd/es/table';

import { Table as BootstrapTable } from 'react-bootstrap';

interface LoginMacacoResult {
  server: string;
  status: boolean;
  credits: number;
  cost: string;
}

interface Log {
  _id: string;
  username: string;
  workid: string;
  SN: string;
  log: string;
  cost: {
    numberDecimal: string;
  };
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  
}

interface ResponseData {
  server: string;
 
  logs: Log[];
}

async function fetchServerStatus(): Promise<LoginMacacoResult> {
  try {
    const response = await fetch('https://frpbosstool-server.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'appver': '1.0.0'
      },
      body: JSON.stringify({
        user: 'guerratool',
        pass: 'GuerratoolAPIaccess!**Pass',
        hwid: 'asd880nf2832nfasd8f23fbas8fasfhwef923a9scd79'
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: LoginMacacoResult = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching server status:', error);
    throw error;
  }
}

async function fetchLogs(page: number, pageSize: number): Promise<ResponseData> {
  try {
    const response = await fetch(`https://frpbosstool-server.onrender.com/panel/getuserlog?page=${page}&pageSize=${pageSize}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'appver': '1.0.0'
      },
      body: JSON.stringify({
        user: 'guerratool',
        pass: 'GuerratoolAPIaccess!**Pass',
        hwid: 'asd880nf2832nfasd8f23fbas8fasfhwef923a9scd79'
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData: ResponseData = await response.json();
    responseData.logs.reverse();
    return responseData;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}





export default function MotorolaServerScreen() {

  const [credits, setCredits] = useState('');
  const [server, setServerStatus] = useState('');
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
 // const [ searchTerm , setSearchTerm] = useState('');
 // const { Search } = Input;

  const apiUrl = 'https://frpbosstool-server.onrender.com/api';
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const { server: serverStatus, credits: creditsData } = await fetchServerStatus();
      const { logs: logsData } = await fetchLogs(page, pageSize);
      setServerStatus(serverStatus);
      setCredits(creditsData.toString());
      setLogs(logsData);
      setPagination(prevPagination => ({ ...prevPagination, total: logsData.length }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleTableChange(pagination: any) {
    fetchData(pagination.current, pagination.pageSize);
    setPagination(pagination);
  }

  // async function handleSearch(value: string) {
  //   setSearchTerm(value);
  //   if (value.trim().length > 2) {
  //     // Implementar a lógica de pesquisa aqui
  //   }
  // }


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


const columns: ColumnsType<Log> = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Work ID',
    dataIndex: 'workid',
    key: 'workid',
  },
  {
    title: 'Serial',
    dataIndex: 'SN',
    key: 'SN',
  },
  {
    title: 'Log',
    dataIndex: 'log',
    key: 'log',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: boolean) => (
      <Tag color={status ? 'green' : 'red'}>{status ? 'OK' : 'NOT OK'}</Tag>
    ),
  },
  {
    title: 'Custo',
    dataIndex: 'cost',
    key: 'cost',
    render: (cost: { $numberDecimal: string }) => (
      <span>{cost.$numberDecimal}</span>
    ),
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt: Date) => (
      <span>{new Date(createdAt).toLocaleString()}</span>
    ),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: Date) => (
      <span>{new Date(updatedAt).toLocaleString()}</span>
    ),
  },
];



const expandedRowRender = (log: Log) => {
  const columns: ColumnsType<Log> = [
    {
      title: 'Work ID',
      dataIndex: 'workid',
      key: 'workid',
    },
    {
      title: 'Log',
      dataIndex: 'log',
      key: 'log',
    },
    // Adicione outras colunas conforme necessário
  ];

  return (
    <Table columns={columns} dataSource={[log]} pagination={false} />
  );
};


const data = [
  {
    key: '1',
    info: 'Server Status',
    value: server,
    FontFace: 'Roboto',
    
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

            <div className='motorola-servers-container'>
              <br /><br /><br /><br /><br />
                <h1 className='title'>GuerraTool - Servidores</h1>
                <h4 className='title' style={{ fontSize: '20px'}}>Samsung </h4>
         
                <div style={{
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20
                }}>
                {loading && <p>Aguarde...</p>}
                <BootstrapTable striped bordered hover>
                  <thead style={{ backgroundColor: "#ffffff"}}>
                    <tr>
                      <th >Info</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.key}>
                        <td style={{  backgroundColor: "#ffffff" }}>{item.info}</td>
                        <td style={{  backgroundColor: "#ffffff" }}>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </BootstrapTable>
                <br />
                <button onClick={handleLogin}>Obter Dados</button>
              </div>
                <br />
                <hr />
                <br />
                <div>

                <h4 className='title' style={{ fontSize: '20px'}}>Logs detalhados</h4>
          {/* <Search placeholder="Search..." onSearch={handleSearch} style={{ width: 200, marginBottom: 16 }} /> */}
          
          <Button style={{
            margin: '10px',
            fontSize: '20px',
            paddingBottom: '45px',
          }} onClick={() => fetchData(1, pagination.pageSize)} disabled={loading} loading={loading}>
            Obter dados com Detalhes
            
          </Button>
        
          {loading && <p>Aguarde...</p>}
          <br />
          <Table
            columns={columns}
            dataSource={logs}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            expandable={{ expandedRowRender }}
            onRow={(record) => ({
              onClick: () => setSelectedLog(record),
            })}
          />
        </div>
        {selectedLog && (
          <div>
            <h2>Selected Log Details</h2>
            <Table columns={columns} dataSource={[{ ...selectedLog }]} pagination={false} />

          </div>
        )}
      </div>
            


            
  

    </>

  )
}
