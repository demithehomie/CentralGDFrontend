import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './FingerPHStoriesTMT.css'
import { Table, Button, Input, Modal, DatePicker } from 'antd'; // Exemplo com Ant Design
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { useNavigate } from 'react-router-dom';

type FingerPrintStoriesDataType = {
    id: number;
    user_id: number;
    changeby: number;
    action: string;
    oldfingerprint: string;
    newfingerprint: string;
    oldip: string;
    newip: string;
    // balance_after: number;
    // ref_user_id: number;
    // order_id: number;
    // note: string;
    // status: string;
    created_at: string;
    updated_at: string;
  };


  const FingerPHStoriesTMT: React.FC = () => {
    const [data, setData] = useState<FingerPrintStoriesDataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FingerPrintStoriesDataType | null>(null);
  const [targetPage, setTargetPage] = useState<string>('');
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);


    const navigate=  useNavigate()

  const apiurl = `https://gdcompanion-prod.onrender.com`; // Substituir pelo seu endpoint real

  const fetchDataWithDates = async () => {
    try {
      const response = await axios.get(`${apiurl}/guerratool/users/fingerprints-with-pagination`, {
        params: {
          page: currentPage,
          limit: 10, // This should match the limit you're using in your API call
          startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
          endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
        },
      });
  
      setData(response.data); // Assuming the response structure is {data: [...], totalRecords: number}
      const totalRecords = response.data.totalRecords;
      console.log(`These are totalRecords: ${totalRecords}`)
      const limit = 10; // This should match the limit you're using in your API call
      const totalPages = Math.ceil(totalRecords / limit);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
  
  // Make sure to adjust your useEffect hook or any other place you're calling fetchData or fetchDataWithDates to use this new logic.
  
  

  useEffect(() => { // DONE
    const abortController = new AbortController();
    const signal = abortController.signal;
  
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiurl}/guerratool/users/fingerprints-with-pagination`, {
          params: {
            page: currentPage,
            limit: 10,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
            endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
          },
          signal: signal // Pass the signal to the request
        });
  
        setData(response.data.data);
        const totalRecords = response.data.totalRecords;
        if (typeof totalRecords === "number") {
          const totalPages = Math.ceil(totalRecords / 10);
          setTotalPages(totalPages);
        } else {
          console.error('totalRecords is not a number:', totalRecords);
        }
  
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
        } else {
          console.error('Erro ao buscar dados:', error);
        }
      }
    };
  
    fetchData();
  
    return () => {
      // Cancel the request when the component is unmounted
      abortController.abort();
    };
  }, [currentPage, startDate, endDate]);
  

  const handleRowClick = (record: FingerPrintStoriesDataType) => {
    setSelectedItem(record);
    setModalVisible(true);
  };

  // Função para montar a mensagem a ser compartilhada
  const formatMessageForSharing = (item: FingerPrintStoriesDataType) => {
    const message = `Change By: ${item.changeby}\nAction: ${item.action}\nOld Fingerprint: ${item.oldfingerprint}\nNew Fingerprint: ${item.newfingerprint}\nOld IP: ${item.oldip}\n´New IP: ${item.newip}\nCreated At: ${new Date(item.created_at).toLocaleString()}\nUpdated At: ${new Date(item.updated_at).toLocaleString()}`;
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
        { title: 'changeby', dataIndex: 'changeby', key: 'changeby' },
        { title: 'action', dataIndex: 'action', key: 'action' },
        { title: 'oldfingerprint', dataIndex: 'oldfingerprint', key: 'oldfingerprint' },
        { title: 'newfingerprint', dataIndex: 'newfingerprint', key: 'newfingerprint' },
        { title: 'oldip', dataIndex: 'oldip', key: 'oldip' },
        { title: 'newip', dataIndex: 'newip', key: 'newip' },
        // { title: 'Balance After', dataIndex: 'balance_after', key: 'balance_after' },
        // { title: 'Ref User ID', dataIndex: 'ref_user_id', key: 'ref_user_id' },
        // { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
        // { title: 'Note', dataIndex: 'note', key: 'note' },
        // { title: 'Status', dataIndex: 'status', key: 'status' },
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

      const fingerprintsGT = () => {
        navigate('/guerratool/fingerprints-history');
    }

  return (
    <>
    <MainNavbar/>
   

    <div>
      <br />
      <br />
      <br />
      <br />
      <h3 style={{ color: '#ffffff'}}>The Magic Tool - Fingerprint Logs</h3>

      <button onClick={fingerprintsGT}>Check GUERRATOOL Fingerprints</button>
      <br /><br />

      <div>
        <DatePicker placeholder="Start Date" onChange={handleStartDateChange} />
        <DatePicker placeholder="End Date" onChange={handleEndDateChange} />
        <Button type="primary" onClick={fetchDataWithDates}>Filter</Button>
      </div>
      <br />

  
      <Table
        dataSource={data ? data.map(item => ({ ...item, key: item.id.toString() })) : []}
        columns={columns}
        pagination={false} // Gerenciando a paginação externamente
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
          {/* Adicionando indicação da página atual */}
          <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#ffffff' }}>Page {currentPage} of {totalPages}</p>
      </div>


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
        title="Fingerprint Details"
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
        <p className='modal-items'><strong>Changeby:</strong> {selectedItem?.changeby}</p>
        <p className='modal-items'><strong>Action:</strong> {selectedItem?.action}</p>
        <p className='modal-items'><strong>Old Fingerprint:</strong> {selectedItem?.oldfingerprint}</p>
        <p className='modal-items'><strong>New Fingerprint:</strong> {selectedItem?.newfingerprint}</p>
        <p className='modal-items'><strong>Old IP:</strong> {selectedItem?.oldip}</p>
        <p className='modal-items'><strong>New IP:</strong> {selectedItem?.newip}</p>
        {/* <p className='modal-items'><strong>Key:</strong> {selectedItem?.key}</p>
        <p className='modal-items'><strong>Source:</strong> {selectedItem?.source}</p>
        <p className='modal-items'><strong>Credit Cost:</strong> {selectedItem?.credit_cost}</p>
        <p className='modal-items'><strong>Credits Quantity:</strong> {selectedItem?.credits_qty}</p>
        <p className='modal-items'><strong>Balance Before:</strong> {selectedItem?.balance_before}</p>
        <p className='modal-items'><strong>Balance After:</strong> {selectedItem?.balance_after}</p>
        <p className='modal-items'><strong>Ref User ID:</strong> {selectedItem?.ref_user_id}</p>
        <p className='modal-items'><strong>Order ID:</strong> {selectedItem?.order_id}</p>
        <p className='modal-items'><strong>Note:</strong> {selectedItem?.note}</p>
        <p className='modal-items'><strong>Status:</strong> {selectedItem?.status}</p> */}
        <p className='modal-items'><strong>Created At:</strong> {selectedItem?.created_at && new Date(selectedItem.created_at).toLocaleString()}</p>
        <p className='modal-items'><strong>Updated At:</strong> {selectedItem?.updated_at && new Date(selectedItem.updated_at).toLocaleString()}</p>

    </Modal>

    </div>
    </>
  );
};

export default FingerPHStoriesTMT;
