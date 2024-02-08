import { useEffect, useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import Swal from 'sweetalert2';
import './ReceiveCrypto.css';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import copyIcon from '../../../src/assets/icons/copy.png';

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
      const { data } = await axios.get(`${apiurlprod}/binance-usdt-deposit-address`);
      setPaymentAddress(data.deposit_address);
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
  //   navigate('/crypto-payments/:paymentId');
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiurlprod}/inserir-cliente-com-crypto`, {
        ...clientFormData,
        wallet_address: paymentAddress, // Enviar wallet_address no formulário
      });
      console.log(clientFormData)
      console.log(paymentAddress)
      console.log(response.data); // Se quiser fazer algo com a resposta do backend
      Swal.fire('Sucesso!', 'Cliente inserido com sucesso.', 'success');
      // Aqui você pode redirecionar o usuário para outra página, se desejar
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
   

        <h2>Receber Criptomoedas</h2>
        
        <form className="crypto-form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="amount">Quantidade a ser recebida em <strong>USDT</strong>:</label>
          <input
          className="input-c"
            type="number"
            id="amount"
            name="amount"
            value={clientFormData.amount}
            onChange={handleInputChange}
            placeholder='Insira a quantia a ser recebida em USDT'
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
                placeholder='Insira o número do Whatsapp do cliente'
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
           
          <label className="label" htmlFor="receiveAddress">Endereço de recebimento:</label>
          <div className='row-of-icons-01'>
              <h5>{paymentAddress ? paymentAddress : 'Link de Pagamento não encontrado'}</h5> 
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
            {/* <button className="rc-button" onClick={navigateToPaymentLink}>Gerar Link</button> */}
            <button type="submit" className="rc-button">Enviar</button>
          </div>
          <h6>Powered By <strong>Binance</strong> </h6>
        </form>
        <button
        // style={{
        //   border: '2px solid #000000',
        // }}
        >Todas as transferências</button>
      </div>
  
    </>
  )
}

export default ReceiveCrypto;