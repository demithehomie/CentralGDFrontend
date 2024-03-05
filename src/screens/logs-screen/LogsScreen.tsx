import MainNavbar from '../../components/main-navbar/MainNavbar'
import moment from 'moment';

import './LogsScreen.css'
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TablePaginationConfig } from 'antd';


export default function LogsScreen() {
    const [logs, setLogs] = useState([]);
   // const [creditLogs, setCreditLogs] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    
      const fetchLogs = async (page: number, pageSize: number) => {
        const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerradone/credit_logs_with_pagination?page=${page}&limit=${pageSize}`);
        return response.data; // { total, page, limit, data }
      };
    
      useEffect(() => {
        fetchLogs(pagination.current, pagination.pageSize).then(data => {
          setLogs(data.data);
          setPagination(p => ({ ...p, total: data.total }));
        });
      }, []);
    
      const handleTableChange = (pagination: { current: number; pageSize: number; }) => {
        fetchLogs(pagination.current, pagination.pageSize).then(data => {
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
        title: 'Date',
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
        title: 'Type',
        dataIndex: 'type',
        key: 'Type',
        width: 90,
      },
      {
        title: 'Amount (CRD)',
        dataIndex: 'Amount_CRD',
        key: 'Amount_CRD',
        width: 90,
      },
      {
        title: 'Description',
        dataIndex: 'Description',
        key: 'Description',
        width: 120,
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
        width: 100,
      },
      {
        title: 'Action',
        dataIndex: 'Action',
        key: 'Action',
        width: 90,
      },
      {
        title: 'Amount Details',
        key: 'amountDetails',
        width: 200,
        render: (record: any) => (
          <>
            <p className='amount--details'>Previous Amount: {record.balance_before}</p>
            <p className='amount--details'>Added Amount: {record.credits_qty}</p>
            <p className='amount--details'>Final Amount: {record.balance_after}</p>
          </>
        ),
      },
      {
        title: 'App',
        dataIndex: 'app',
        key: 'app',
        width: 100,
      },
      {
        title: 'Staff Member',
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
                        <h2>Logs Screen</h2>
                        <hr />
                        <h2>The Magic Tool and GUERRATOOL - Credit Logs</h2>
                        <h4 style={{
                          color: 'white',
                        }}>Credits inserted by the GUERRADONE Team</h4>
                      
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