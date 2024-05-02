import MainNavbar from '../../components/main-navbar/MainNavbar'
import moment from 'moment';

import './LogsScreen.css'
import  { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TablePaginationConfig } from 'antd';
import { getToken } from '../../services/UsersService';


export default function LogsScreen() {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
      });

      const [abortController, setAbortController] = useState(new AbortController()); // Mantenha o AbortController no estado
      const token = getToken()
    
      const fetchLogs = async (page: any, pageSize: any, signal: any) => {
        try {
          const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerradone/credit_logs_with_pagination?page=${page}&limit=${pageSize}`, { 
            
          headers: {
            'Authorization': `Bearer ${token}`
          },
          
          signal });
          return response.data;
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Request aborted');
          } else {
            console.error('Erro ao buscar dados:', error);
          }
          return null;
        }
      };

      const signal = abortController.signal;

      
      useEffect(() => { // DONE
        const signal = abortController.signal;
        
      
        fetchLogs(pagination.current, pagination.pageSize, signal).then(data => {
          if (data) {
            setLogs(data.data);
            setPagination(p => ({ ...p, total: data.total }));
          }
        });
      
        return () => {
          console.log("Limpando o controller de aborto");
          abortController.abort(); // Abortando a solicitação anterior
          setAbortController(new AbortController()); // Criando um novo controller de aborto para a próxima solicitação
      };
  }, []);

  
      const handleTableChange = (pagination: { current: number; pageSize: number; }) => {
        fetchLogs(pagination.current, pagination.pageSize, signal).then((data: { data: SetStateAction<never[]>; total: any; }) => {
          setLogs(data.data);
          setPagination(p => ({ ...p, total: data.total, current: pagination.current }));
        });
      };
  
    const columns = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
        width: 120,
      },
      {
        title: 'Data',
        dataIndex: 'Date',
        key: 'Date',
        width: 200,
        render: (text: moment.MomentInput) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        title: 'Username',
        dataIndex: 'Username',
        key: 'Username',
        width: 180,
      },
      {
        title: 'Tipo',
        dataIndex: 'type',
        key: 'Type',
        width: 90,
      },
      {
        title: 'Quantia (CRD)',
        dataIndex: 'Amount_CRD',
        key: 'Amount_CRD',
        width: 90,
      },
      {
        title: 'Descrição',
        dataIndex: 'Description',
        key: 'Description',
        width: 120,
        // render: (record: any) => {
     
        //   if (record.Description === 'Credit for purchase') {
        //     return <p>Crédito para compra. </p>;
        //   } else {
        //     return <p>Crédito para outra coisa {record.Description}</p>;
        //   }
    
        // }
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
        width: 100,
      },
      {
        title: 'Ação',
        dataIndex: 'Action',
        key: 'Action',
        width: 90,
      },
      {
        title: 'Detalhes da Quantia',
        key: 'amountDetails',
        width: 200,
        render: (record: any) => (
          <>
            <p className='amount--details'>Quantia anterior: {record.balance_before}</p>
            <p className='amount--details'>Quantia adicionada: {record.credits_qty}</p>
            <p className='amount--details'>Quantia final: {record.balance_after}</p>
          </>
        ),
      },
      {
        title: 'Veio de Onde?',
        dataIndex: 'app',
        key: 'app',
        width: 100,
      },
      {
        title: 'Membro da Equipe',
        dataIndex: 'staff_member',
        key: 'staff_member',
        width: 100
      },
      
    ];
  
    return (
      <>
        <MainNavbar/>
   
       
                    <div className="logs-screen-container">
                    <div className="responsive-table-container">
                        <br />
                        <h2>Central de Logs</h2>
                        <hr />
                        <h2>The Magic Tool e GUERRATOOL - Logs de Creditos</h2>
                  
                      
                        <Table
                            dataSource={logs}
                            columns={columns}
                            pagination={pagination}
                            onChange={(pagination: TablePaginationConfig) => handleTableChange({
                                current: pagination.current || 1,
                                pageSize: pagination.pageSize || 10 // Provide a default value for pageSize
                            })}
                            rowKey="ID"
                            scroll={{ x: 'max-content' }} // Isso garante que a tabela seja scrollable horizontalmente se necessário
                        />
                        </div>


               
             
                    </div>

                    <h2></h2>
      </>
    );
  }