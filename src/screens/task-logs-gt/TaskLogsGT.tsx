import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './TaskLogsGT.css'
import { Table, Button, Input, Modal, DatePicker } from 'antd'; // Exemplo com Ant Design
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { useNavigate } from 'react-router-dom';

type TaskDataType = {
    id: number;
    user_id: number;
    credit_id: number;
    task_name: string;
    model: string;
    imei: string;
    serial: string;
    carrier: string;
    logs: string;
    status: string;
    date: string;
    fingerprint: string;
    client_ip: string;
  };


  const TaskLogsGT: React.FC = () => {
    const [data, setData] = useState<TaskDataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TaskDataType | null>(null);
  const [targetPage, setTargetPage] = useState<string>('');
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

const navigate = useNavigate()

  const apiurl = `https://gdcompanion-prod.onrender.com`; // Substituir pelo seu endpoint real

  const fetchDataWithDates = async () => {
    try {
      const response = await axios.get(`${apiurl}/guerratool/users/tasklogs-with-pagination`, {
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
          const response = await axios.get(`${apiurl}/guerratool/users/tasklogs-with-pagination`, {
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

  const handleRowClick = (record: TaskDataType) => {
    setSelectedItem(record);
    setModalVisible(true);
  };

  // Função para montar a mensagem a ser compartilhada
const formatMessageForSharing = (item: TaskDataType) => {
    const message = `Task Name: ${item.task_name}\nModel: ${item.model}\nIMEI: ${item.imei}\nSerial: ${item.serial}\nCarrier: ${item.carrier}\nStatus: ${item.status}\nDate: ${new Date(item.date).toLocaleString()}\nClient IP: ${item.client_ip}\nLogs: ${item.logs}`;
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
    { title: 'Task Name', dataIndex: 'task_name', key: 'task_name' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'IMEI', dataIndex: 'imei', key: 'imei' },
    { title: 'Serial', dataIndex: 'serial', key: 'serial' },
    { title: 'Carrier', dataIndex: 'carrier', key: 'carrier' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (text: string) => (new Date(text)).toLocaleDateString() + ' ' + (new Date(text)).toLocaleTimeString() }, // Exemplo de como formatar a data
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


      const taskLogsTMT = () => {
        navigate('/tmt-task-logs');
    }

  return (
    <>
    <MainNavbar/>
    <div className="task-logs-gt-container"> {/* Adicione esta linha */}
    <div>
        <br />
        <br />
        <br />
        <br />
    <h3 style={{ color: '#ffffff'}}>GUERRATOOL - Task Logs</h3>
   
   <button onClick={taskLogsTMT}>Check The Magic Tool Task Logs</button>
   <br /><br />

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
        dataSource={data ? data.map(item => ({ ...item, key: item.id })) : []}
        columns={columns}
        pagination={false}
        onRow={(record) => ({
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
        <p className='modal-items'><strong>Task Name:</strong> {selectedItem?.task_name}</p>
        <p className='modal-items'><strong>Model:</strong> {selectedItem?.model}</p>
        <p className='modal-items'><strong>IMEI:</strong> {selectedItem?.imei}</p>
        <p className='modal-items'><strong>Serial:</strong> {selectedItem?.serial}</p>
        <p className='modal-items'><strong>Carrier:</strong> {selectedItem?.carrier}</p>
        <p className='modal-items'><strong>Status:</strong> {selectedItem?.status}</p>
        <p className='modal-items'><strong>Date:</strong> {selectedItem?.date && new Date(selectedItem.date).toLocaleString()}</p>
        <p className='modal-items'><strong>Client IP:</strong> {selectedItem?.client_ip}</p>
        <p className='modal-items'><strong>Logs:</strong> <pre>{selectedItem?.logs}</pre></p> {/* Usando <pre> para preservar quebras de linha e espaçamento */}
    </Modal>
    </div>
    </div>
    </>
  );
};

export default TaskLogsGT;
