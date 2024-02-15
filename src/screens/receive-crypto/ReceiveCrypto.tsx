import { useEffect, useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import Swal from 'sweetalert2';
import './ReceiveCrypto.css';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import copyIcon from '../../../src/assets/icons/copy.png';
import usdtlogo from '../../../src/assets/icons/USDT-ICON.png';

import { Helmet } from 'react-helmet-async';

// interface UserData {
//   user_id : string;
// }

// interface TransferData {
//   id: string;
//   status: string;
//   service_provided: string;
//   payment_id: number;
//   payment_link: string;
//   qr_code: string;
//   qr_code_cec: string;
//   username: string;
//   name: string;
//   amount: number;
//   credit: number;
//   pending_payments: string | boolean;
//   setStatusPaymentApproved: boolean;
//   created_at: string
//   setStatusPaymentPending: (status: boolean) => boolean;
// }

interface ClientFormData {
  name: string;
  whatsapp: string;
  service_provided: string;
  amount: number;
  username: string;
}

const ReceiveCrypto: React.FC = () => {
 // const apiurldev = 'http://localhost:3001';
  const apiurlprod = 'https://gdcompanion-prod.onrender.com';
 // const navigate = useNavigate();
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    name: '',
    whatsapp: '',
    service_provided: '',
    amount: 0,
    username: '',
  });

  useEffect(() => {
    fetchPaymentAddress();
  }, []);

  const fetchPaymentAddress = async () => {
    try {
      const { data } = await axios.get(`${apiurlprod}/binance-user-id`);
      setPaymentAddress(data.id_to_receive_payment );
      console.log( `Isso é o que está vindo do backend => ${data}`)
    } catch (error) {
      console.error("Failed to fetch payment address:", error);
      Swal.fire('Erro!', 'Falha ao buscar o endereço de pagamento.', 'error');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(`Updating ${name} with value ${value}`);
    setClientFormData(prevState => ({
      ...prevState,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };
  

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire('Copiado!', 'Endereço copiado com sucesso.', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      Swal.fire('Erro!', 'Falha ao copiar o endereço.', 'error');
    }
  };

  // const navigateToPaymentLink = () => {
  //   const paymentId = localStorage.getItem('payment_id');
  //   navigate(`/crypto-payments/${paymentId}`);
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clientFormData.amount || clientFormData.amount <= 0) {
      Swal.fire('Erro!', 'A quantia a ser recebida deve ser maior que zero.', 'error');
      return; // Interrompe a execução da função
    }
    const payment_id = Math.floor(Math.random() * 100000000);
    try {
      const response = await axios.post(`${apiurlprod}/inserir-cliente-com-crypto`, {
        ...clientFormData,
        payment_id: payment_id,
        wallet_address: paymentAddress, 
      });
      console.log(clientFormData)
      console.log(paymentAddress)
      console.log(response.data); 
     // Swal.fire('Sucesso!', 'Cliente inserido com sucesso.', 'success');
      localStorage.setItem('payment_id', JSON.stringify(response.data.payment_id));
      const paymentLink = `${apiurlprod}/crypto-payments/${response.data.payment_id}`;
    // Swal popup to show the payment link
    Swal.fire({
      title: 'Payment Link Generated',
      html: `<p>Use the link below to access the payment page:</p><pre>${paymentLink}</pre>`,
      showCancelButton: true,
      confirmButtonText: 'Copy Link',
      cancelButtonText: 'Access Page',
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(paymentLink).then(() => {
          Swal.fire('Copied!', 'The link has been copied to your clipboard.', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //navigate(`/crypto-payments/${response.data.payment_id}`);
        window.open(paymentLink, '_blank');
      }
    });
    // Rest of your success handling...
    //Swal.fire('Sucesso!', 'Cliente inserido com sucesso.', 'success');
    } catch (error) {
      console.error('Erro ao inserir cliente:', error);
      Swal.fire('Erro!', 'Falha ao inserir cliente.', 'error');
    }
  };

  return (
    <>
    <MainNavbar/>
    <br />
    <div className="receive-crypto-container">


    <br /><br /><br /><br /><br />
   
      <div className='title-box'>
      <img src={usdtlogo} alt="usdt-logo" className='usdtlogo' /> 
      <h2>Receber USDT </h2>
    
      </div>
      
        
        <form className="crypto-form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="amount">Quantidade a ser recebida em <strong>USDT</strong>:</label>
          <input
          className="input-c"
            type="number"
            id="amount"
            name="amount"
            value={clientFormData.amount > 0 ? clientFormData.amount : ''}
            onChange={handleInputChange}
            placeholder='Insira a quantia em USDT'
          />
            <label className="label" htmlFor="name">Nome do Cliente</label>
          <input
          className="input-c"
            type="text"
            id="name"
            name="name"
             value={clientFormData.name}
             onChange={handleInputChange}
              placeholder='Insira o nome do cliente'
          />
            <label className="label" htmlFor="service_provided">Serviço Prestado</label>
          <input
          className="input-c"
            type="text"
            id="service_provided"
            name="service_provided"
             value={clientFormData.service_provided}
             onChange={handleInputChange}
              placeholder='Insira o serviço prestado'
          />
      
            <label className="label" htmlFor="whatsapp">Whatsapp</label>
            <input
            className="input-c"
              type="number"
              id="whatsapp"
              name="whatsapp"
               value={clientFormData.whatsapp}
               onChange={handleInputChange}
                placeholder='Insira o Whatsapp do cliente'
            />

        <label htmlFor="username">Username (Opcional)</label>
          <input
           className="input-c"
            type="text"
            id="username"
            name="username"
            value={clientFormData.username || ''}
            onChange={handleInputChange}
            placeholder='Insira o username do cliente (opcional)'
          />

          {/* Campo invisível para enviar wallet_address */}
          <input type="hidden" name="wallet_address" value={paymentAddress || ''} />
           
          <label className="label" htmlFor="receiveAddress">ID Binance para recebimento:</label>
          <div className='row-of-icons-01'>
          <h5 className="custom-style-id">{paymentAddress ? paymentAddress : 'Link de Pagamento não encontrado'}</h5> 
                <div onClick={() => copyToClipboard(paymentAddress || '')}>
                  <img className='copy-icon-01' src={copyIcon} alt="icone-copiar" style={{cursor: 'pointer'}} />
                </div>
               
          </div>
          {/* <input
          className="input"
            type="text"
            id="receiveAddress"
            value={receiveAddress}
            onChange={(e) => setReceiveAddress(e.target.value)}
          /> */}
          <div className="rc-button-group">
            {/* <button className="rc-button" onClick={handleSendCrypto}>Enviar</button>
            <button className="rc-button" onClick={handleReceiveCrypto}>Receber</button> */}
            {/*
            
             <button className="rc-button" onClick={navigateToPaymentLink}>Gerar Link</button>
            Botão para gerar o link de pagamento */}
         {}   <button type="submit" className="rc-button">Continuar</button>
          </div>
          <h6 style={{ color: "#000000"}}>Powered By <strong>Binance</strong> </h6>
        </form>
        <button
        // style={{
        //   border: '2px solid #000000',
        // }}
        >Todas as transferências</button>
      </div>
      <Helmet>
        <title>Recebendo Crypto</title>
      </Helmet>
  
    </>
  )
}

export default ReceiveCrypto;