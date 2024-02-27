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
        dataIndex: 'Type',
        key: 'Type',
      },
      {
        title: 'Amount (CRD)',
        dataIndex: 'Amount_CRD',
        key: 'Amount_CRD',
      },
      {
        title: 'Description',
        dataIndex: 'Description',
        key: 'Description',
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
      },
      {
        title: 'Action',
        dataIndex: 'Action',
        key: 'Action',
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
      }
      
    ];
  
    return (
      <>
        <MainNavbar/>
   
       
                    <div className="logs-screen-container">
                        <br />
                        <h2>Logs Screen</h2>
                        <hr />
                        <h2>GUERRADONE Credit Logs</h2>
                        <Table
                            dataSource={logs}
                            columns={columns}
                            pagination={pagination}
                            onChange={(pagination: TablePaginationConfig) => handleTableChange({
                                current: pagination.current || 1,
                                pageSize: pagination.pageSize || 10 // Provide a default value for pageSize
                            })}
                            rowKey="ID"
                            scroll={{ y: 300 }} // Adjust the height value (240px) as needed
                        />


                    <h2>The Magic Tool - Credit Logs</h2>
                    <h2>GUERRATOOL - Credit Logs</h2>
                    </div>

                    <h2></h2>
      </>
    );
  }