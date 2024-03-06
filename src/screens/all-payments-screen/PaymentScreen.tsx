
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, /*useParams*/ } from 'react-router-dom';
import './PaymentScreen.css';
import Swal from 'sweetalert2';
//import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { formatDate } from '../../services/ConversrionService';
//import Toast from '../../components/toast/Toast';
import { useToast } from '../../context/toast/ToastProvider';
//import { useTimePassed } from '../../personalized-hooks/useTimePassed';


interface UserData {
  user_id: string;
  // Add other properties as needed
}

interface TransferData {
  id: string;
  status: string;
  service_provided: string;
  payment_id: number;
  payment_link: string;
  qr_code: string;
  qr_code_cec: string;
  username: string;
  name: string;
  amount: number;
  credit: number;
  pending_payments: string | boolean;
  setStatusPaymentApproved: boolean;
  created_at: string
  setStatusPaymentPending: (status: boolean) => boolean;
}

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
 // const { userId } = useParams<{ userId: string }>();
  const [userData, /* setUserData */] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    email: 'leandroguerratool@gmail.com',
    nome: 'Leandro',
    sobrenome: 'Guerra',
    cpf: '10050031732',
    transaction_amount: 0.01,
  });
  const [isTransactionAmountEnabled, setIsTransactionAmountEnabled] = useState(true);

  const [responsePayment, setResponsePayment] = useState<AxiosResponse | null>(null);
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState<string | null>(null);
  const [statusPaymentApproved, setStatusPaymentApproved] = useState<boolean>(false);
  const [statusPaymentPending, setStatusPaymentPending] = useState<boolean>(true);
  const [pendingTransfers, setPendingTransfers] = useState<TransferData[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [lastRefreshed , setLastRefreshed] = useState<Date | null>(null)
  const [renderedIds, setRenderedIds] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);




const triggerToast = useToast();


// Verifique se o item deve ser renderizado
const shouldRenderItem = (transfer: TransferData) => {
  const currentTime = new Date();
  const ThirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000); // 10 minutes ago
 // const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000); // 2 minutes ago

  return (
    (transfer.pending_payments === 'true' || transfer.pending_payments === true) ||
    (transfer.pending_payments === 'expired' && new Date(transfer.created_at) >= ThirtyMinutesAgo)||
    (transfer.pending_payments === 'false' && new Date(transfer.created_at) >= ThirtyMinutesAgo)
  );
};


  useEffect(() => {
    // Fetch pending transfers when the component mounts
    setLastRefreshed(new Date());
    fetchPendingTransfers();
  }, []);

  const [clientFormData, setClientFormData] = useState({
    name: '',
    whatsapp: '',
    service_provided: '',
    amount: formData.transaction_amount
  });

  const handleClientFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientFormData({
      ...clientFormData,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };


  

  useEffect(() => {
    const atualizarStatusPagamento = async () => {
      try {
        // Suponha que você tenha o ID do cliente disponível
        const clientId = localStorage.getItem(`clienteId`)/* ID do cliente */;
        
        // Fazer a requisição POST para atualizar o status do pagamento do cliente
        await axios.post('https://gdcompanion-prod.onrender.com/atualizar-status-pagamento', { clientId });

        // Aguardar 5 segundos antes de recarregar a página
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } catch (error) {
        console.error('Erro ao atualizar pagamento do cliente:', error);
      }
    };

    if (statusPaymentApproved) {
      atualizarStatusPagamento();
    }
  }, [statusPaymentApproved]);
  
  const calculateTotalAmount = (amount: number) => {
    const addedPercentage = amount * 0.01; // 1% of the amount
    return amount + addedPercentage;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerToast('success', 'Texto copiado para a área de transferência!');
       // alert('Texto copiado para a área de transferência!');
        // toast.success('Texto copiado para a área de transferência!', {
        //   position: "bottom-left",
        // });
      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
        triggerToast('error', 'Erro ao copiar texto.');
      });
  };

 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'transaction_amount' ? parseFloat(value) : value,
    });
  };

  const getStatusPaymentViaMercadoPagoWithResponse = async () => {
    try {
      const paymentId = responsePayment?.data?.id;
      if (paymentId) {
        const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621'; // Replace with your MercadoPago API access token
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data.status === 'approved') {
          const paymentId = responsePayment?.data?.id;
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
        // alert("Pagamento ainda não foi feito"); //
        //  toast.warn("Pagamento ainda não foi feito", {
        //   position: "bottom-left",
        // });
          console.log(`Not approved - Payment status: ${response.data.status}`);
        }
      } else {
        console.error('Payment ID is undefined. Cannot fetch payment status.');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  };
  
  const getStatusPaymentViaMercadoPago = async () => {
    try {
      const paymentId = selectedTransfer?.payment_id; 
      if (paymentId) {
        const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621'; // Replace with your MercadoPago API access token
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data.status === 'approved') {
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
        // alert("Pagamento ainda não foi feito"); //
        //  toast.warn("Pagamento ainda não foi feito", {
        //   position: "bottom-left",
        // });
          console.log(`Not approved - Payment status: ${response.data.status}`);
        }
      } else {
        console.error('Payment ID is undefined. Cannot fetch payment status.');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  };
  
  const backToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let finalTransactionAmount = formData.transaction_amount;
  if (isTransactionAmountEnabled) {
    finalTransactionAmount = calculateTotalAmount(formData.transaction_amount);
  } else {
    finalTransactionAmount = formData.transaction_amount;
  }

    // Preparando o corpo da requisição para o MercadoPago
    const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621';
    const idempotencyKey = `${Date.now()}-${Math.random()}`; // Chave de idempotência

    const paymentBody = {
      transaction_amount: finalTransactionAmount,//calculateTotalAmount(formData.transaction_amount),
      description: 'Família Guerra',
      payment_method_id: 'pix',
      payer: {
        email: formData.email,
        first_name: formData.nome,
        last_name: formData.sobrenome,
        identification: {
          type: 'CPF',
          number: formData.cpf,
        },
      },
      notification_url: 'https://eorpjcvcjvhqnq6.m.pipedream.net',
    };

    try {
      // Enviando dados para o MercadoPago
      const paymentResponse = await axios.post('https://api.mercadopago.com/v1/payments', paymentBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Idempotency-Key': idempotencyKey,
        },
      });
      setResponsePayment(paymentResponse);
      setLinkBuyMercadoPago(paymentResponse.data.point_of_interaction.transaction_data.ticket_url);
	    console.log('Resposta do Servidor:', JSON.stringify(paymentResponse.data, null, 2));
      setLinkBuyMercadoPago(paymentResponse.data.point_of_interaction.transaction_data.ticket_url);
      console.log('Link para pagamento:', paymentResponse.data.point_of_interaction.transaction_data.ticket_url);
      console.log('Payment ID:', paymentResponse.data.id);
      console.log('FORMDATA:', formData);

      if(
        paymentResponse.data && 
        paymentResponse.data.status &&
        paymentResponse.data.id && 
        paymentResponse.data.point_of_interaction &&
        paymentResponse.data.point_of_interaction.transaction_data &&
        paymentResponse.data.point_of_interaction.transaction_data.ticket_url &&
        paymentResponse.data.point_of_interaction.transaction_data.qr_code_base64 &&
        paymentResponse.data.point_of_interaction.transaction_data.qr_code
        ) {

        const paymentId = paymentResponse.data.id;
        const paymentStatus = paymentResponse.data.status;
        const paymentLink = paymentResponse?.data?.point_of_interaction?.transaction_data?.ticket_url;
        const qrCode = paymentResponse?.data?.point_of_interaction?.transaction_data?.qr_code_base64;
        const qrcodeCopiaECola = paymentResponse?.data?.point_of_interaction?.transaction_data?.qr_code;
    
        console.log('DB - Payment ID:', paymentId); // Para depuração
        console.log('DB - Link de Pagamento:', paymentLink); // Para depuração
        console.log('DB - QrCode Imagem:', qrCode); // Para depuração
        console.log('DB - QrCode Copia e Cola:', qrcodeCopiaECola); // Para depuração
        console.log('DB - QrCode Copia e Cola:', paymentStatus); // Para depuração
    
        if (paymentId && qrCode && qrcodeCopiaECola && paymentLink) {
            const clientData = {
                name: clientFormData.name,
                whatsapp: clientFormData.whatsapp,
                service_provided: clientFormData.service_provided,
                amount: finalTransactionAmount, // calculateTotalAmount(formData.transaction_amount),
                payment_id: paymentId, 
                qr_code: qrCode,
                qr_code_cec: qrcodeCopiaECola,
                payment_link: paymentLink,
                status: paymentStatus,
            };
    
            try {
              // Enviar dados do cliente para o servidor
              const response = await axios.post('https://gdcompanion-prod.onrender.com/inserir-cliente', clientData);
              console.log('Resposta do servidor:', response);
              // Lógica adicional após o envio bem-sucedido
            } catch (error) {
              console.error('Erro ao enviar dados do cliente para o servidor:', error);
            }
          } else {
            console.error('Payment ID is undefined. Cannot send client data to server.');
          }
        } else {
          console.error('Payment response data is undefined or missing an ID.');
        }
      } catch (error) {
        console.error('Erro ao processar o pagamento:', error);
        console.log(`Deu ruim: ${JSON.stringify(error)}`);
        console.log(`Deu ruim: ${JSON.stringify(paymentBody)}`);
      }
    };



  const fetchPendingTransfers = async () => {
    try {
      // Replace this with your API endpoint to fetch pending transfers
      const response = await axios.get('https://gdcompanion-prod.onrender.com/pending-transfers-from-clients');
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
  


  useEffect(() => {
    if (linkBuyMercadoPago && statusPaymentPending) {
      // Forçar recarga da página
    // alert("Seu pagamento está pendente. Aguarde a aprovação.");
    //  toast.info("Seu pagamento está pendente. Aguarde a aprovação.", {
    //   position: "bottom-left",
    // });
    triggerToast('info', "Seu pagamento está pendente. Aguarde a aprovação.");
    }
  }, [linkBuyMercadoPago, statusPaymentPending]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Chama a função que verifica o status do pagamento
      getStatusPaymentViaMercadoPago();
      // ou
      // getStatusPaymentViaMercadoPagoWithResponse();
    }, 10000); // 30000 ms = 30 segundos
  
    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [
    statusPaymentApproved
  ]); // Passando um array vazio como segundo argumento para garantir que isso rode apenas uma vez ao montar
  
  

  useEffect(() => {
    // Calcular os IDs que devem ser renderizados e atualizar o estado de uma só vez
    const newRenderedIds = pendingTransfers
      .filter(shouldRenderItem)
      .map(transfer => transfer.id);
  
    setRenderedIds(newRenderedIds);
  }, [pendingTransfers]);

  const handleCellClick = (transfer: TransferData) => {
    setSelectedTransfer(transfer);
    setShowPopup(true);
  };
  
  const openPaymentLinkInNewTab = (url: string | URL | undefined) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    // Verifica se o status do pagamento é aprovado
    if (statusPaymentApproved) {
      // Chama as funções para verificar o status do pagamento via Mercado Pago
      getStatusPaymentViaMercadoPagoWithResponse();
      getStatusPaymentViaMercadoPago();
    }
  }, [statusPaymentApproved]); 

  useEffect(() => {
    // Função para recarregar os dados de pagamentos pendentes
    const recarregarDados = async () => {
      // Aqui, você chamaria a função para buscar os dados atualizados, como 'fetchPendingTransfers'
      await fetchPendingTransfers();
    };
  
    recarregarDados();
  }, [statusPaymentApproved]); // Dependendo de como você rastreia a aprovação de pagamentos
  
  const navigateToReports = () => {
    navigate('/mgmt-reports');
  }

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
    }).then(async (result) => {
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

  const calculateTimePassed = (createdAt: string | number | Date) => {
    const startDate = new Date(createdAt).getTime();
    const currentDate = new Date().getTime();
    const seconds = Math.floor((currentDate - startDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days} dia(s)`;
    if (hours > 0) return `${hours} hora(s)`;
    if (minutes > 0) return `${minutes} minuto(s)`;
    return `${seconds} segundo(s)`;
  };
  
  // const useTimePassed = (createdAt: any) => {
  //   const [timePassed, setTimePassed] = useState('');
  
  //   useEffect(() => {
  //     const update = () => {
  //       const startDate = new Date(createdAt).getTime();
  //       const currentDate = new Date().getTime();
  //       const diff = currentDate - startDate;
  
  //       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //       const minutes = Math.floor((diff / (1000 * 60)) % 60);
  //       const seconds = Math.floor((diff / 1000) % 60);
  
  //       setTimePassed(`${days} dia(s) ${hours} hora(s) ${minutes} minuto(s) ${seconds} segundo(s)`);
  //     };
  
  //     update(); // Inicializa imediatamente
  //     const interval = setInterval(update, 1000); // Atualiza a cada segundo
  
  //     return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  //   }, [createdAt]);
  
  //   return timePassed;
  // };

  const initializeComponent = () => {
    setIsLoading(true); // Supondo que você queira começar com o estado de carregamento
    fetchPendingTransfers(); // Buscar os dados iniciais necessários
    setLastRefreshed(new Date());// Defina qualquer outro estado inicial aqui
  };
  
  useEffect(() => {
    initializeComponent();
    // Se você tiver outras operações de inicialização que só devem acontecer uma vez, elas ainda podem ser colocadas aqui
  }, []);
  
  
  // const handleRefresh = () => {
  //   setRemountKey(prevKey => prevKey + 1); // Isso irá forçar a remontagem
  //   fetchPendingTransfers();
  // };
  
  

  // Antes de renderizar
if (pendingTransfers && Array.isArray(pendingTransfers)) {
  pendingTransfers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
  

  return (
    <>
   {/* <div key={remountKey} className="App"> */}
   <div>
      {/* <button onClick={() => triggerToast('success')}>Sucesso</button>
      <button onClick={() => triggerToast('error')}>Erro</button>
      {/* <button onClick={() => triggerToast('info')}>Informação</button> */}
      {/* <button onClick={() => triggerToast('warning')}>Aviso</button>  */}
      {/* <Toast show={toast.show} onClose={() => setToast({ show: false, type: '' })} type={toast.type}>
        Mensagem do Toast ({toast.type})
      </Toast> */}
    </div>

    <div className="App">
      <MainNavbar />
      <br /><br /><br /><br /><br />
       <Helmet>
        <title>Recebendo PIX</title>
      </Helmet>
      <div className="App-header">
        <h3 style={{ color: '#ffffff', fontSize: '30px' }}>Gerar PIX</h3>
        <h4>Destino: Leandro Guerra - Mercado Pago</h4>
        <h3 style={{ color: '#ffffff' }}>{userData?.user_id}</h3>

        {isLoading && <div></div>}
        {lastRefreshed && <div></div>}
        {renderedIds && <div></div>}
        

        {!responsePayment && (
          <form onSubmit={handleSubmit}>
            <div className="transaction-input-container">
              <label>Valor a Receber</label>
              <input
                type="number"
                onChange={handleChange}
                value={formData.transaction_amount}
                name="transaction_amount"
              />
              <div>
  <label>
    Inserir Juros na Transação?
    <input
      type="checkbox"
      checked={isTransactionAmountEnabled}
      onChange={(e) => setIsTransactionAmountEnabled(e.target.checked)}
    />
  </label>
</div>

              <div>
                <strong style={{ color: '#ffffff' }}>Total (com a Taxa de 1%): </strong>
                <label style={{ color: '#ffffff' }}>
                  {calculateTotalAmount(formData.transaction_amount).toFixed(2)}
                </label>
              </div>
            </div>

            <div className="client-form-container">
              <h4>Dados do Cliente</h4>
              <input
                type="text"
                name="name"
                value={clientFormData.name}
                onChange={handleClientFormChange}
                placeholder="Nome do Cliente"
              />
              <input
                type="text"
                name="whatsapp"
                value={clientFormData.whatsapp}
                onChange={handleClientFormChange}
                placeholder="WhatsApp"
              />
              <input
                type="text"
                name="service_provided"
                value={clientFormData.service_provided}
                onChange={handleClientFormChange}
                placeholder="Serviço Fornecido"
              />
              <input
                hidden
                type="number"
                name="amount"
                value={formData.transaction_amount}
                onChange={handleClientFormChange}
                placeholder="Valor"
              />
            </div>

            <button type="submit">Gerar QR Code e Copia e Cola</button>
          </form>
        )}

        {linkBuyMercadoPago && (
          <>
            <button className="payment-buttons" onClick={() => copyToClipboard(linkBuyMercadoPago)}>
              Copiar Link de Pagamento
            </button>
            <button className="payment-buttons" onClick={() => window.open(linkBuyMercadoPago, '_blank')}>
              Acessar Link de Pagamento
            </button>
          </>
        )}

        {responsePayment?.data?.point_of_interaction?.transaction_data?.qr_code && (
          <button className="payment-buttons" onClick={() => copyToClipboard(responsePayment.data.point_of_interaction.transaction_data.qr_code)}>
            Copiar Pix Copia e Cola
          </button>
        )}

        <div className="pix-payment-container">
          {responsePayment && (
            <button className="payment-buttonstransferênc-danger" onClick={getStatusPaymentViaMercadoPagoWithResponse}>
              Verificar status de pagamento
            </button>
          )}

          {linkBuyMercadoPago && statusPaymentPending && (
            <iframe src={linkBuyMercadoPago} width="600px" height="620px" title="link_buy" />
          )}

          {statusPaymentApproved && (
            <>
              <h1 style={{ color: '#ffffff' }}>Transferência Aprovada</h1>
              <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
            </>
          )}
        </div>
      </div>

      {/* <button className="refresh-button" onClick={initializeComponent}>
        Recarregar
      </button> */}

      {/* <button
      className="refresh-button"
      onClick={handleRefresh}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      Atualizar
    </button> */}


      <div className="PixPendentes">
      <hr />
     
      <div className="pending-transfers-list">
        {pendingTransfers && Array.isArray(pendingTransfers) && pendingTransfers.length > 0 ? (
          <div className="pending-transfers-table-container">
            <h3 style={{ color: '#ffffff', fontSize: '20px' }}>Pix Pendentes </h3>
          
            <table className="pending-transfers-table">
              <br />
            
           
              <thead>
                <tr>
                  <th style={{ color: 'white', textAlign: 'center' }}>Quantia</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>Nome</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>PIX</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>Pendente</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>Iniciado em</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>Iniciado há</th>
                  <th style={{ color: 'white', textAlign: 'center' }}>DELETAR</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransfers.map((transfer) => {
                  //  const timePassed = useTimePassed(transfer.created_at);
                  if (shouldRenderItem(transfer)) {
                    return (
                  
                      <tr key={transfer.id} className="pending-transfer-row">
                        <td style={{ color: 'black' }}>{transfer.amount}</td>
                        <td style={{ color: 'black' }}>{transfer.name}</td>
                        <td
                          style={{ 
                            color: "#ffffff", 
                            cursor: 'pointer',
                            backgroundColor: 'blue',
                            fontWeight: 'bold',
                          }}
                          onClick={() => handleCellClick(transfer)}
                        >
                          INFO
                          {/* {transfer.qr_code_cec} */}
                        </td>
                        <td style={{ color: 'black' }}>
                          {statusPaymentApproved || transfer.pending_payments === 'false' ? (
                            <div className="badge badge-success">DONE</div>
                          ) : transfer.pending_payments === 'true' || transfer.pending_payments === true ? (
                            <div className="loader"></div>
                          ) : transfer.pending_payments === 'expired' ? (
                            <div className="badge badge-expired">EXPIRED</div>
                          ) : null}
                        </td>
                        <td>
                        <td style={{ color: 'black' }}>{formatDate(transfer.created_at)}</td>
                 
                        </td>
                        <td style={{ color: 'black' }}>{calculateTimePassed(transfer.created_at)}</td>
                        {/* <td style={{ color: 'black' }}>{timePassed}</td> */}
                        <td
                          style={{ 
                            color: "#ffffff", 
                            cursor: 'pointer',
                            backgroundColor: 'red',
                            fontWeight: 'bold',
                          }}
                          onClick={() => deleteCliente(transfer.payment_id.toString())}
                        >
                          DELETE
                          {/* {transfer.qr_code_cec} */}
                        </td>

                      </tr>
               
                    );
                  }

                  return null;
                })}
              </tbody>
            </table>

            <div style={{ display: "flex", margin: "auto", alignItems: "center", justifyContent: "center"}}>
                  <button className='outline-button' onClick={navigateToReports}>Ver todos os relatórios</button>
              </div>
          </div>
        ) : (
          <p>No pending transfers found.</p>
        )}
      </div>
    </div>

    {/* {showPopup && selectedTransfer && (
      <div className="popup">
      <h2 style={{ color: '#000000' }}>Gerando PIX</h2>
      <label style={{ color: '#000000' }}> Devedor:  {selectedTransfer.name}</label>
      <label style={{ color: '#000000' }}> Quantia:  {selectedTransfer.amount}</label>
      <label style={{ color: '#000000' }}> Payment ID:  {selectedTransfer.id}</label>
      <label style={{ color: '#000000' }}> Serviço Prestado:  {selectedTransfer.service_provided}</label>
      <img 
        src={`data:image/png;base64,${selectedTransfer.qr_code}`} alt="QR Code" />
      <button onClick={() => copyToClipboard(selectedTransfer.qr_code_cec)}>Copiar Pix</button>
      <button onClick={() => openPaymentLinkInNewTab(selectedTransfer.payment_link)}>Abrir Link de Pagamento</button>
        <button
          style={{ backgroundColor: 'red', color: 'white' }}
          onClick={getStatusPaymentViaMercadoPago}
        >
          Validar Pagamento
        </button>
        <button onClick={(() => setShowPopup(false))}>Fechar</button>
      
      </div>
    )} */}

{showPopup && selectedTransfer && (
  <div className="popup-background">
    <div className="popup">
      <h2 style={{ color: '#000000' }}>Gerando PIX</h2>
      <label style={{ color: '#000000' }}> Devedor:  {selectedTransfer.name}</label>
      <label style={{ color: '#000000' }}> Quantia:  {selectedTransfer.amount}</label>
      <label style={{ color: '#000000' }}> Payment ID:  {selectedTransfer.id}</label>
      <label style={{ color: '#000000' }}> Serviço Prestado:  {selectedTransfer.service_provided}</label>
      <img 
        src={`data:image/png;base64,${selectedTransfer.qr_code}`} alt="QR Code" />
      <button onClick={() => copyToClipboard(selectedTransfer.qr_code_cec)}>Copiar Pix</button>
      <button onClick={() => openPaymentLinkInNewTab(selectedTransfer.payment_link)}>Abrir Link de Pagamento</button>
      <button
          style={{ backgroundColor: 'red', color: 'white' }}
          onClick={getStatusPaymentViaMercadoPago}
        >
          Validar Pagamento
        </button>
      <button
        style={{ backgroundColor: 'red', color: 'white' }}
        onClick={() => setShowPopup(false)}
      >
        Fechar
      </button>
    </div>
  </div>
)}


  </div>

  {/* </div> */}
  </>
  );
  
  
};

export default PaymentScreen;
