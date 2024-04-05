import axios from 'axios';
import { TransferData } from '../../../services/PaymentService';
import { useEffect, useState } from 'react';
import { useToast } from '../../../context/toast/ToastProvider';
import Swal from 'sweetalert2';
import './index.css';
import { Badge, Spin, Table, Tag } from 'antd';


export const Component2 = () => {
 const [selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);
 const [statusPaymentApproved, setStatusPaymentApproved] = useState<boolean>(false);
 const [statusPaymentPending, setStatusPaymentPending] = useState<boolean>(true);
 const [pendingTransfers, setPendingTransfers] = useState<TransferData[]>([]);
 const [isLoading, setIsLoading] = useState(true); 
 const [potentialClients, setPotentialClients] = useState<TransferData[]>([])
    const [renderedIds, setRenderedIds] = useState<string[]>([]);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);


 const triggerToast = useToast();

 const fetchPotentialClients = async () => {
    try {
      // Replace this with your API endpoint to fetch pending transfers
      const response = await axios.get('https://gdcompanion-prod.onrender.com/payments-center/pending/get-the-5-most-recent');
      if (response.data) {
        const potentialClientsData: TransferData[] = response.data;
        setPotentialClients(potentialClientsData);
        console.log(response.data)
      }
    } catch (error) {
      console.error('Error fetching pending transfers:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when data is fetched or if an error occurs
    }
  };

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
          const newRenderedIds = potentialClients
            .filter(shouldRenderItem)
            .map(transfer => transfer.id);
        
          setRenderedIds(newRenderedIds);
          setLastRefreshed(new Date());
          fetchPotentialClients();
         
        }, [potentialClients]);

 const potenciaisPagadores = [
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
        title: 'Done?',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          return status === 'pending' ? <Spin /> : <Badge status="success" text="Done" />;
        }
    },
    {
        title: 'Cobrar',
        dataIndex: 'charged',
        key: 'charged',
        render: (status: string) => {
            return status === 'no' ? <Badge status="error" text="Cobrar" /> : <Badge  status="warning" text="Cobrado" />;
          }
    },
]

 const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerToast('success', 'Texto copiado para a área de transferência!');

      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
        triggerToast('error', 'Erro ao copiar texto.');
      });
  };

  const deleteCliente = async (paymentId: string) => {
    // SweetAlert de Confirmação
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, delete isso!'
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`https://gdcompanion-prod.onrender.com/deletar-cliente/${paymentId}`);
          if (response.status === 200) {
            Swal.fire(
              'Deletado!',
              'O cliente foi deletado.',
              'success'
            );
            // Atualize o estado da sua aplicação aqui
            // Por exemplo, removendo o cliente deletado da lista de pendências
            setPendingTransfers(prevTransfers => prevTransfers.filter(transfer => transfer.payment_id.toString() !== paymentId));
          } else {
            Swal.fire(
              'Erro!',
              'Cliente não encontrado ou já foi deletado.',
              'error'
            );
          }
        } catch (error) {
          console.error('Erro ao deletar cliente:', error);
          Swal.fire(
            'Erro!',
            'Erro ao tentar deletar o cliente.',
            'error'
          );
        }
      }
    });
  };
  


    const getStatusPaymentViaMercadoPago = async () => {
        try {
          const paymentId = selectedTransfer?.payment_id; 
          if (paymentId) {
            const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621'; // Replace with your MercadoPago API access token
            const response = await axios.get(`https://gdcompanion-prod.onrender.com/mercadopago/payment/check/${paymentId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
      
            if (response.data.status === 'approved') { // NÃO ESUQECE DE IMPLEMENTAR O REFUNDED
              // Remova a redefinição de paymentId aqui, pois você já definiu como selectedTransfer.payment_link
              axios.post('https://gdcompanion-prod.onrender.com/atualizar-status-pagamento-cliente', { payment_id: paymentId })
                .then(response => {
                  console.log('Pagamento atualizado com sucesso:', response);
                  // Tratar a resposta, atualizar o estado do frontend se necessário
                })
                .catch(error => {
                  console.error('Erro ao atualizar o pagamento:', error);
                });
              setStatusPaymentApproved(true);
              setStatusPaymentPending(false); // Set pending status to false when payment is approved
              console.log(`Payment status: ${response.data.status}`);
            } else {
              triggerToast('warning', "Pagamento ainda não foi feito");
       
              console.log(`Not approved - Payment status: ${response.data.status}`);
            }
          } else {
            console.error('Payment ID is undefined. Cannot fetch payment status.');
          }
        } catch (error) {
          console.error('Error fetching payment status:', error);
        }
      };

      const openPaymentLinkInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank');
      };

      const handleRowClick = (record: any) => {
        // Aqui você pode fazer o que quiser com o registro clicado
        console.log('Registro clicado:', record);
        // Chame sua função aqui
       
      };

    
    return (
  <>
    
            <div className="popup-">
            <br /><br /><br />
            <div style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '50px',
                width: '100px',
                height: '100px',
                alignContent: 'center',
                borderRadius: '50%',
                margin: 'auto'
            }}>2</div>
               <br />
       
            <h3>COBRAR PIX</h3>
            <Table 
                columns={potenciaisPagadores} 
                dataSource={potentialClients} 
                loading={isLoading}  
                pagination={{ pageSize: 5 }}
                onRow={(record, rowIndex) => {
                    return {
                      onClick: () => handleRowClick(record),
                    };
                  }}
      
            />
          
        </div>
  
  </>
       

    );
};