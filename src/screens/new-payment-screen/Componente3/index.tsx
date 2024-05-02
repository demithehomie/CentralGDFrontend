import { Badge,  Button, Spin, Table, Modal } from "antd"

import { useEffect, useState } from "react";
import axios from 'axios';
import { TransferData } from "../../../services/PaymentService";

//import Swal from 'sweetalert2';
import './index.css';
import { getToken } from "../../../services/UsersService";

export default function Component3() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pendingTransfers, setPendingTransfers] = useState<TransferData[]>([]);
    const [doneTransfers, setDoneTransfers] = useState<TransferData[]>([]);
    const [_renderedIds, setRenderedIds] = useState<string[]>([]);
    const [_lastRefreshed , setLastRefreshed] = useState<Date | null>(null);
    const [_selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);
    const [_showPopup, setShowPopup] = useState(false);
    const [showDevedoresPopup, setShowDevedoresPopup] = useState(false);
    const token = getToken()

//     const deleteCliente = async (paymentId: string) => {
//   // SweetAlert de Confirmação
//   Swal.fire({
//     title: 'Tem certeza?',
//     text: "Você não poderá reverter isso!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Sim, delete isso!'
//   }).then(async (result: any) => {
//     if (result.isConfirmed) {
//       try {
//         const response = await axios.delete(`https://gdcompanion-prod.onrender.com/deletar-cliente/${paymentId}`);
//         if (response.status === 200) {
//           Swal.fire(
//             'Deletado!',
//             'O cliente foi deletado.',
//             'success'
//           );
//           // Atualize o estado da sua aplicação aqui
//           // Por exemplo, removendo o cliente deletado da lista de pendências
//           setPendingTransfers(prevTransfers => prevTransfers.filter(transfer => transfer.payment_id.toString() !== paymentId));
//         } else {
//           Swal.fire(
//             'Erro!',
//             'Cliente não encontrado ou já foi deletado.',
//             'error'
//           );
//         }
//       } catch (error) {
//         console.error('Erro ao deletar cliente:', error);
//         Swal.fire(
//           'Erro!',
//           'Erro ao tentar deletar o cliente.',
//           'error'
//         );
//       }
//     }
//   });
// };

     const fetchPendingTransfers = async () => {
        try {
          // Replace this with your API endpoint to fetch pending transfers
          const response = await axios.get('https://gdcompanion-prod.onrender.com/pending-transfers-from-clients', 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (response.data) {
            const pendingTransfersData: TransferData[] = response.data;
            setPendingTransfers(pendingTransfersData);
            console.log(response.data)
          }
        } catch (error) {
          console.error('Error fetching pending transfers:', error);
        } finally {
          setIsLoading(false); // Set loading state to false when data is fetched or if an error occurs
        }
      };


      const fetchDoneTransfers = async () => {
        try {
          // Replace this with your API endpoint to fetch pending transfers
          const response = await axios.get('https://gdcompanion-prod.onrender.com/payments-center/get-all-succesful-clients');
          if (response.data) {
            const doneTransfersData: TransferData[] = response.data;
            setDoneTransfers(doneTransfersData);
            console.log(response.data)
          }
        } catch (error) {
          console.error('Error fetching pending transfers:', error);
        } finally {
          setIsLoading(false); // Set loading state to false when data is fetched or if an error occurs
        }
      };

    //  const triggerToast = useToast();


// Verifique se o item deve ser renderizado
const shouldRenderItem = (transfer: TransferData) => {
  const currentTime = new Date();
  //const ThirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000); // 10 minutes ago
  const TenDaysAgo = new Date(currentTime.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
 // const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000); // 2 minutes ago

 return (
  (transfer.pending_payments === 'true' || transfer.pending_payments === true) ||
  (transfer.pending_payments === 'expired' && new Date(transfer.created_at) >= TenDaysAgo) ||
  (transfer.pending_payments === 'false' && new Date(transfer.created_at) >= TenDaysAgo)
);
};


      useEffect(() => {
        // Calcular os IDs que devem ser renderizados e atualizar o estado de uma só vez
        const newRenderedIds = pendingTransfers
          .filter(shouldRenderItem)
          .map(transfer => transfer.id);
      
        setRenderedIds(newRenderedIds);
        setLastRefreshed(new Date());
        fetchPendingTransfers();
       
      }, [pendingTransfers]);

      useEffect(() => {
        // Calcular os IDs que devem ser renderizados e atualizar o estado de uma só vez
        const newRenderedIds = doneTransfers
          .filter(shouldRenderItem)
          .map(transfer => transfer.id);
      
        setRenderedIds(newRenderedIds);
        setLastRefreshed(new Date());
        fetchDoneTransfers();
       
      }, [doneTransfers]);

      const handleCellClick = (transfer: TransferData) => {
        setSelectedTransfer(transfer);
        setShowPopup(true);
      };

      const calculateTimePassed = (createdAt: string | number | Date) => {
        if (typeof createdAt === 'string') {
          const startDate = new Date(createdAt).getTime();
          if (!isNaN(startDate)) {
            const currentDate = new Date().getTime();
            const seconds = Math.floor((currentDate - startDate) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days} dia(s)`;
            if (hours > 0) return `${hours} hora(s)`;
            if (minutes > 0) return `${minutes} minuto(s)`;
            return `${seconds} segundo(s)`;
          } else {
            return 'Data inválida';
          }
        } else {
          return 'Data inválida';
        }
      };
      

    const clientes = [
        {
            title: '$$',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'PIX',
           // dataIndex: 'pix',
            key: 'pix',
           // render: 
           render: (_text: string, record: TransferData) => (
            <button
              style={{ 
                color: "#ffffff", 
                cursor: 'pointer',
                backgroundColor: 'blue',
                fontWeight: 'bold',
              }}
              onClick={() => handleCellClick(record)}
            >
              INFO
            </button>
          ),
        },
            
        
        {
            title: 'Done?',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
              return status === 'pending' ? <Spin /> : <Badge status="success" text="Done" />;
          }
        },
        // {
        //     title: 'Iniciado em',
        //     dataIndex: 'created_at',
        //     key: 'created_at',
        //     render: (createdAt: string) => formatDate(createdAt)
        // },
        {
            title: 'Tempo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (createdAt: string) => calculateTimePassed(createdAt)
        },
        // {
        //     title: 'Excluir',
        //     dataIndex: 'payment_id',
        //     key: 'payment_id',
        //     render: (_text: string, record: TransferData) => (
        //         <button
        //         style={{ 
        //             color: "#ffffff", 
        //             cursor: 'pointer',
        //             backgroundColor: 'red',
        //             fontWeight: 'bold',
        //           }}
        //           onClick={() => deleteCliente(record.payment_id.toString())}
        //         >
        //           DELETE
        //         </button>
        //       ),
        // },

    ]





  return (
    <>

<Modal
        visible={showDevedoresPopup}
        onCancel={() => setShowDevedoresPopup(false)}
        footer={null} // Remove default footer for cleaner popup
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
        }}
      >
         <Table 
      columns={clientes} 
      dataSource={pendingTransfers} 
      loading={isLoading}  
      pagination={{ pageSize: 7 }}
      
      />
  
  
      </Modal>
   
    <div style={{
        backgroundColor: "#ffffff"
    }}>
        <br /><br /><br /><br />
        <div style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '50px',
                width: '100px',
                height: '100px',
                alignContent: 'center',
                borderRadius: '50%',
                margin: 'auto'
            }}>3</div>
            
            <br />
            <h3 style={{ color: '#000000'}}>VALIDAR PAGAMENTO</h3>
  
  {/* {showDevedoresPopup && }
    <Table 
      columns={clientes} 
      dataSource={pendingTransfers} 
      loading={isLoading}  
      pagination={{ pageSize: 7 }}
      
      />

      <button onClick={() => setShowDevedoresPopup(true)}>

      </button> */}

<Button onClick={() => setShowDevedoresPopup(true)}>Mostrar Devedores Antigos</Button>
   
   
    </div>

    </>
    
  )
}
