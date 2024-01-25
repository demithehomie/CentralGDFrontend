
//import { initMercadoPago } from '@mercadopago/sdk-react'
// initMercadoPago('TEST-9eec9374-8ba1-419b-80e7-295a8c55343c');


// const token = `APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621`
   
// const idempotencyKey = `0d5020ed-1af6-469c-ae06-c3bec19954bb`;
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PaymentScreen.css';

interface UserData {
  user_id: string;
  // Add other properties as needed
}

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://gdcompanion-2fns.onrender.com/users/${userId}`);
        if (response.ok) {
          const userData: UserData = await response.json();
          setUserData(userData);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchUser();
  }, [userId]);

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

    const token = 'APP_USR-5220412533742046-011815-549eea6144946c47d1c330d299e6fb6a-419577621'; // Replace with your MercadoPago API access token
    const idempotencyKey =  generateIdempotencyKey();// '0d5020ed-1af6-469c-ae06-c3bec19954bb'; // Replace with your desired idempotency key

    const body = {
      transaction_amount: calculateTotalAmount(formData.transaction_amount),
      description: 'Família Guerra',
      payment_method_id: 'pix',
      payer: {
        email: 'leandroguerratool@gmail.com', //formData.email,
        first_name: `Leandro`, //formData.nome,
        last_name: `Guerra `,// formData.sobrenome,
        identification: {
          type: 'CPF',
          number: `10050031732`//formData.cpf,
        },
      },
      notification_url: 'https://eorpjcvcjvhqnq6.m.pipedream.net',
    };

    try {
      const response = await axios.post('https://api.mercadopago.com/v1/payments', body, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Idempotency-Key': idempotencyKey,
        },
      });
      setResponsePayment(response);
      
      console.log('Resposta do Servidor:', JSON.stringify(response.data, null, 2));
      setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url);
      console.log('Link para pagamento:', response.data.point_of_interaction.transaction_data.ticket_url);
      console.log('Payment ID:', response.data.id);
      console.log('FORMDATA:', formData);

    } catch (error) {
      
      console.log(`Deu ruim: ${JSON.stringify(error)}`);
      console.log(`Deu ruim: ${JSON.stringify(body)}`);
    }
  };

  const generateIdempotencyKey = () => {
    // Generate a unique idempotency key, e.g., using a timestamp or UUID
    return `${Date.now()}-${Math.random()}`;
  };

  return (
    <div className="App">
      <div className="App-header">
        <h3 style={{ color: '#ffffff', fontSize: '30px' }}>Gerar PIX</h3>
        <h3 style={{ color: '#ffffff' }}>{userData?.user_id}</h3>

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
            <br />
              <div>
    <strong style={{ color: '#ffffff' }}>Total (com a Taxa de 1%): </strong>
   <label style={{ color: '#ffffff' }}>{calculateTotalAmount(formData.transaction_amount).toFixed(2)}</label>
    
  </div>
        </div>
            <br />
            {/* <div>
              <label style={{ color: '#ffffff' }}>E-mail</label>
              <input
                onChange={handleChange}
                value={formData.email}
                name="email"
              />
            </div>
            <br />
            <div>
              <label style={{ color: '#ffffff' }}>Nome</label>
              <input
                onChange={handleChange}
                value={formData.nome}
                name="nome"
              />
            </div>
            <br />
            <div>
              <label style={{ color: '#ffffff' }}>CPF</label>
              <input
                onChange={handleChange}
                value={formData.cpf}
                name="cpf"
              />
            </div>
            <br /> */}
            <div>
              <button type="submit">Gerar QR Code e Copia e Cola</button>
            </div>
          </form>
        )}

        {linkBuyMercadoPago && (
          <>
            <button className='payment-buttons' onClick={() => copyToClipboard(linkBuyMercadoPago)}>
              Copiar Link de Pagamento
            </button> 
            <button className='payment-buttons' onClick={() => window.open(linkBuyMercadoPago, '_blank')}>
              Acessar Link de Pagamento
            </button>
          </>
        )}

        {responsePayment?.data?.point_of_interaction?.transaction_data?.qr_code && (
          <button className='payment-buttons' onClick={() => copyToClipboard(responsePayment.data.point_of_interaction.transaction_data.qr_code)}>
            Copiar Pix Copia e Cola
          </button>
        )}

        <div className="pix-payment-container">
          {responsePayment && (
            <button className='payment-buttons-danger' onClick={getStatusPayment}>
              Verificar status de pagamento
            </button>
          )}

          {linkBuyMercadoPago && statusPaymentPending && (
            <>
            <iframe src={linkBuyMercadoPago} width="600px" height="620px" title="link_buy" />
            </>
            )}

          {statusPaymentApproved && (
            <>
              <h1 style={{ color: '#ffffff' }}>Transferência Aprovada</h1>
            <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
            </>
          
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
