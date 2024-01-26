
//import { initMercadoPago } from '@mercadopago/sdk-react'
// initMercadoPago('TEST-9eec9374-8ba1-419b-80e7-295a8c55343c');


// const token = `APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621`
   
// const idempotencyKey = `0d5020ed-1af6-469c-ae06-c3bec19954bb`;
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, /*useParams*/ } from 'react-router-dom';
import './PaymentScreen.css';

interface UserData {
  user_id: string;
  // Add other properties as needed
}

interface TransferData {
  id: string;
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
  const [responsePayment, setResponsePayment] = useState<AxiosResponse | null>(null);
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState<string | null>(null);
  const [statusPaymentApproved, setStatusPaymentApproved] = useState<boolean>(false);
  const [statusPaymentPending, setStatusPaymentPending] = useState<boolean>(true);
  const [pendingTransfers, setPendingTransfers] = useState<TransferData[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [renderedIds, setRenderedIds] = useState<string[]>([]);

  // Verifique se o item deve ser renderizado
// Verifique se o item deve ser renderizado
// Verifique se o item deve ser renderizado
const shouldRenderItem = (transfer: TransferData) => {
  const currentTime = new Date();
  const tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000); // 10 minutes ago

  return (
    (transfer.pending_payments === 'true' || transfer.pending_payments === true) ||
    (transfer.pending_payments === 'expired' && new Date(transfer.created_at) >= tenMinutesAgo)
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

  const updateTransactionAmount = (amount: any) => {
    setFormData({ ...formData, transaction_amount: amount });
  };

  useEffect(() => {
    const atualizarStatusPagamento = async () => {
      try {
        // Suponha que você tenha o ID do cliente disponível
        const clientId = localStorage.getItem(`clienteId`)/* ID do cliente */;
        
        // Fazer a requisição POST para atualizar o status do pagamento do cliente
        await axios.post('https://gdcompanion-prod.onrender.com/atualizar-status-pagamento-cliente', { clientId });

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
        alert('Texto copiado para a área de transferência!');
      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
      });
  };

 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'transaction_amount' ? parseFloat(value) : value,
    });
  };

  const getStatusPayment = async () => {
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
          setStatusPaymentApproved(true);
          setStatusPaymentPending(false); // Set pending status to false when payment is approved
          console.log(`Payment status: ${response.data.status}`);
        } else {
          alert("Pagamento ainda não foi feito"); //
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

    // Preparando o corpo da requisição para o MercadoPago
    const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621';
    const idempotencyKey = `${Date.now()}-${Math.random()}`; // Chave de idempotência

    const paymentBody = {
      transaction_amount: calculateTotalAmount(formData.transaction_amount),
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

      // Preparar dados do cliente para enviar para o servidor
      const clientData = {
        name: clientFormData.name,
        whatsapp: clientFormData.whatsapp,
        service_provided: clientFormData.service_provided,
        amount: calculateTotalAmount(formData.transaction_amount),
      };

      // Enviar dados do cliente para o servidor
      const responseCliente = await axios.post('https://gdcompanion-prod.onrender.com/inserir-cliente', clientData);
    
      // Supondo que a resposta do servidor inclui um campo 'id'
      if (responseCliente.data && responseCliente.data.id) {
        localStorage.setItem('clienteId', responseCliente.data.id);
      }

      // Aqui você pode adicionar qualquer lógica adicional após o envio bem-sucedido
    } catch (error) {
      console.error('Erro ao processar o pagamento ou enviar dados do cliente:', error);
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
      alert("Seu pagamento está pendente. Aguarde a aprovação.");
    }
  }, [linkBuyMercadoPago, statusPaymentPending]);

  const checkAndMarkExpiredPayments = async () => {
    try {
      await axios.post('https://gdcompanion-prod.onrender.com/verificar-e-marcar-expirados');
      console.log('Pagamentos expirados verificados e marcados com sucesso.');
    } catch (error) {
      console.error('Erro ao verificar e marcar pagamentos expirados:', error);
    }
  };
  
  // Chama a função inicialmente
  checkAndMarkExpiredPayments();
  setInterval(checkAndMarkExpiredPayments, 300000);

  useEffect(() => {
    // Calcular os IDs que devem ser renderizados e atualizar o estado de uma só vez
    const newRenderedIds = pendingTransfers
      .filter(shouldRenderItem)
      .map(transfer => transfer.id);
  
    setRenderedIds(newRenderedIds);
  }, [pendingTransfers]);

  return (
    <div className="App">
      <div className="App-header">
        <h3 style={{ color: '#ffffff', fontSize: '30px' }}>Gerar PIX</h3>
        <h4>Destino: Leandro Guerra - Mercado Pago</h4>
        <h3 style={{ color: '#ffffff' }}>{userData?.user_id}</h3>

        {isLoading && <div></div>}

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
            <button className="payment-buttons-danger" onClick={getStatusPayment}>
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

      <div className="PixPendentes">
        <hr />
        <h3 style={{ color: '#ffffff', fontSize: '20px' }}>Pix Pendentes</h3>
        <div className="pending-transfers-list">
          {pendingTransfers && Array.isArray(pendingTransfers) && pendingTransfers.length > 0 ? (
            <div className="pending-transfers-table-container">
             <table className="pending-transfers-table">
            <thead>
              <tr>
                <th style={{ color: 'white' }}>Quantia</th>
                <th style={{ color: 'white' }}>Nome</th>
                <th style={{ color: 'white' }}>Pendente</th>
              </tr>
            </thead>
            <tbody>
              {pendingTransfers.map((transfer) => {
                if (shouldRenderItem(transfer)) {
                  // Registre o ID do item como renderizado
             

                  return (
                    <tr key={transfer.id} className="pending-transfer-row">
                      <td style={{ color: 'black' }}>{transfer.amount}</td>
                      <td style={{ color: 'black' }}>{transfer.name}</td>
                      <td style={{ color: 'black' }}>
                        {transfer.pending_payments === 'true' || transfer.pending_payments === true ? (
                          <div className="loader"></div>
                        ) : transfer.pending_payments === 'expired' || transfer.pending_payments === 'expired' ? (
                          <div className="badge badge-expired">EXPIRED</div>
                        ) : null}
                      </td>
                    </tr>
                  );
                }

                return null;
              })}
            </tbody>
          </table>
            </div>
          ) : (
            <p>No pending transfers found.</p>
          )}
        </div>
      </div>
    </div>
  );
  
  
};

export default PaymentScreen;
