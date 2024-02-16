import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './CreditLogsGT.css'
import { Table, Button, Input, Modal, DatePicker } from 'antd'; // Exemplo com Ant Design
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { useNavigate } from 'react-router-dom';

type CreditDataType = {
    id: number;
    user_id: number;
    type: string;
    key: string;
    source: string;
    credit_cost: number;
    credits_qty: number;
    balance_before: number;
    balance_after: number;
    ref_user_id: number;
    order_id: number;
    note: string;
    status: string;
    created_at: string;
    updated_at: string;
  };


  const CreditLogsGT: React.FC = () => {
    const [data, setData] = useState<CreditDataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CreditDataType | null>(null);
  const [targetPage, setTargetPage] = useState<string>('');
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);


    const navigate=  useNavigate()

  const apiurl = `https://gdcompanion-prod.onrender.com`; // Substituir pelo seu endpoint real

  const fetchDataWithDates = async () => {
    try {
      const response = await axios.get(`${apiurl}/guerratool/users/creditlogs-with-pagination`, {
        params: {
          page: currentPage,
          limit: 10,
          startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
          endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
        },
      });
  
      setData(response.data.records);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${apiurl}/guerratool/users/creditlogs-with-pagination`, {
            params: {
              page: currentPage,
              limit: 10, // ou outro valor conforme sua lógica de paginação
              startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
              endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
            },
          });
      
          // Ajuste aqui, assumindo que a resposta é diretamente o array de registros
          setData(response.data); // response.data já é o array esperado
          // Você precisará ajustar o cálculo do totalPages com base na sua lógica de backend
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      };

fetchData();
}, [currentPage, startDate, endDate]);

  const handleRowClick = (record: CreditDataType) => {
    setSelectedItem(record);
    setModalVisible(true);
  };

  // Função para montar a mensagem a ser compartilhada
  const formatMessageForSharing = (item: CreditDataType) => {
    const message = `Credit Type: ${item.type}\nKey: ${item.key}\nSource: ${item.source}\nCredit Cost: ${item.credit_cost}\nCredits Quantity: ${item.credits_qty}\nBalance Before: ${item.balance_before}\nBalance After: ${item.balance_after}\nRef User ID: ${item.ref_user_id}\nOrder ID: ${item.order_id}\nNote: ${item.note}\nStatus: ${item.status}\nCreated At: ${new Date(item.created_at).toLocaleString()}\nUpdated At: ${new Date(item.updated_at).toLocaleString()}`;
    return encodeURIComponent(message);
  };
  
  //const TaskDetailsModal: 

const handleCopy = async () => {
    if (selectedItem) {
      const message = formatMessageForSharing(selectedItem);
      try {
        await navigator.clipboard.writeText(decodeURIComponent(message));
        alert('Details copied to clipboard!'); // Feedback para o usuário
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy details to clipboard.');
      }
    }
  };

  
    // Função para compartilhar no WhatsApp
    const handleShareOnWhatsApp = () => {
      if (selectedItem) {
        const message = formatMessageForSharing(selectedItem);
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank'); // Abrindo o URL do WhatsApp em uma nova aba
      }
    };



    const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Key', dataIndex: 'key', key: 'key' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Credit Cost', dataIndex: 'credit_cost', key: 'credit_cost' },
        { title: 'Credits Qty', dataIndex: 'credits_qty', key: 'credits_qty' },
        { title: 'Balance Before', dataIndex: 'balance_before', key: 'balance_before' },
        { title: 'Balance After', dataIndex: 'balance_after', key: 'balance_after' },
        { title: 'Ref User ID', dataIndex: 'ref_user_id', key: 'ref_user_id' },
        { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
        { title: 'Note', dataIndex: 'note', key: 'note' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (text: string) => (new Date(text)).toLocaleDateString() + ' ' + (new Date(text)).toLocaleTimeString() },
        { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', render: (text: string) => (new Date(text)).toLocaleDateString() + ' ' + (new Date(text)).toLocaleTimeString() },
      ];
      


  const gotoPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetPage(e.target.value);
  };

  const submitPageChange = () => {
    const page = parseInt(targetPage, 10);
    if (page && page > 0 && page <= totalPages) {
      gotoPage(page);
    }
  };

    // Manipulador para mudança na data de início
    const handleStartDateChange = (date: { format: () => moment.MomentInput; }, _dateString: any) => {
        const momentDate = date ? moment(date.format()) : null;
        setStartDate(momentDate);
      };
    
      // Manipulador para mudança na data de término
      const handleEndDateChange = (date: { format: () => moment.MomentInput; }, _dateString: any) => {
        const momentDate = date ? moment(date.format()) : null;
        setEndDate(momentDate);
      };

      const CreditLogsGt = () => {
        navigate('/gt-credit-logs');
    }

  return (
    <>
    <MainNavbar/>
   
    <div>
        <br />
        <br />
        <br />
        <br />
    <h3 style={{ color: '#ffffff'}}>The Magic Tool - Credit Logs</h3>
   
    <button onClick={CreditLogsGt}>Check GUERRATOOL Task Logs</button>
    <br />br

<div>

  <DatePicker
    placeholder="Start Date"
    onChange={handleStartDateChange}
  />
  <DatePicker
    placeholder="End Date"
    onChange={handleEndDateChange}
  />
  <Button type="primary" onClick={fetchDataWithDates}>
    Filter
  </Button>
</div>
<br />
        <Table
        dataSource={data ? data.map(item => ({ ...item, key: item.id.toString() })) : []}
        columns={columns}
        pagination={false}
        onRow={(record: CreditDataType) => ({
            onClick: () => handleRowClick(record),
        })}
        />

      <div style={{ marginTop: '20px' }}>
        <Button onClick={() => gotoPage(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </Button>
        <Input
          style={{ width: '100px', margin: '0 10px' }}
          value={targetPage}
          onChange={handlePageChange}
          placeholder="Page #"
        />
        <Button onClick={submitPageChange}>Go</Button>
        <Button onClick={() => gotoPage(currentPage + 1)} disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>
      <Modal
        title="Task Details"
        visible={modalVisible}
        // onOk={() => setModalVisible(false)}
        onCancel={handleClose}
        footer={[
            <Button key="close" onClick={handleClose} type="text">
            Close
          </Button>,
            <Button key="copy" onClick={handleCopy}>
              Copy
            </Button>,
            <Button key="share" onClick={handleShareOnWhatsApp} type="primary">
              Share on WhatsApp
            </Button>,
          ]}
        >
        <p className='modal-items'><strong>Type:</strong> {selectedItem?.type}</p>
        <p className='modal-items'><strong>Key:</strong> {selectedItem?.key}</p>
        <p className='modal-items'><strong>Source:</strong> {selectedItem?.source}</p>
        <p className='modal-items'><strong>Credit Cost:</strong> {selectedItem?.credit_cost}</p>
        <p className='modal-items'><strong>Credits Quantity:</strong> {selectedItem?.credits_qty}</p>
        <p className='modal-items'><strong>Balance Before:</strong> {selectedItem?.balance_before}</p>
        <p className='modal-items'><strong>Balance After:</strong> {selectedItem?.balance_after}</p>
        <p className='modal-items'><strong>Ref User ID:</strong> {selectedItem?.ref_user_id}</p>
        <p className='modal-items'><strong>Order ID:</strong> {selectedItem?.order_id}</p>
        <p className='modal-items'><strong>Note:</strong> {selectedItem?.note}</p>
        <p className='modal-items'><strong>Status:</strong> {selectedItem?.status}</p>
        <p className='modal-items'><strong>Created At:</strong> {selectedItem?.created_at && new Date(selectedItem.created_at).toLocaleString()}</p>
        <p className='modal-items'><strong>Updated At:</strong> {selectedItem?.updated_at && new Date(selectedItem.updated_at).toLocaleString()}</p>

    </Modal>

    </div>
    </>
  );
};

export default CreditLogsGT;
