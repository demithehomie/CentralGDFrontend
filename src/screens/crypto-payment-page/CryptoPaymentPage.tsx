import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
//import qrcodefull_b from '../../../src/assets/qrcodefull_b.jpeg';
import binance_logo from '../../../src/assets/icons/binance.svg';
import binance_pay_wide from '../../../src/assets/icons/binance_pay_wide.png';
import { Helmet } from 'react-helmet-async';
import './CryptoPaymentPage.css';

interface PaymentInfo {
    paymentAddress: string;
    expirationDate: string; // ou Date, dependendo de como você quer lidar com datas
    // Adicione outras propriedades conforme necessário
  }
interface AllPaymentInfo {
  id: string;
  name: string;
  whatsapp: string;
  service_provided: string;
  amount: number;
  created_at: string;
    payment_id: string;
    wallet_address: string;
    binance_user_id: string;
  }  

const CryptoPaymentPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [ /*paymentInfo,*/, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentAllInfo, setPaymentId] = useState<AllPaymentInfo | null>(null);
  const [binanceUserId, setBinanceUserId] = useState<AllPaymentInfo | null>(null);
  const [clientId, setClientId] = useState<AllPaymentInfo | null>(null);
  const [clientName, setClientName] = useState<AllPaymentInfo | null>(null);
  const [serviceProvided, setServiceProvided] = useState<AllPaymentInfo | null>(null);
  const [amount, setAmount] = useState<AllPaymentInfo | null>(null);
  const [expired, setExpired] = useState(false);

  //const apiurldev = 'http://localhost:3001';
  const apiurlprod = 'https://gdcompanion-prod.onrender.com';

  const fetchPaymentInfo = async (): Promise<PaymentInfo> => {
    try {
      const { data } = await axios.get(`${apiurlprod}/get-client-by-paymentid-crypto/${paymentId}`);
      setPaymentId(data.payment_id);
      setBinanceUserId(data.binance_user_id);
      setClientId(data.id);
      setClientName(data.name);
      setServiceProvided(data.service_provided);
      setAmount(data.amount);
      console.log(paymentId)
      console.log(paymentAllInfo)
      console.log(`Isso é o que está vindo do backend => ${JSON.stringify(data)}`);
      return data; // Add this line to return the fetched payment information
    } catch (error) {
      console.error("Failed to fetch payment address:", error);
      Swal.fire('Erro!', 'Falha ao buscar o endereço de pagamento.', 'error');
      throw error; // Add this line to throw the error
    }
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Done!',
        text: 'Now use it to pay with your Binance account via Binance Pay.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        
      });
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
    });
  };

  // const updatePaymentStatus = async (paymentId: string) => {
  //   axios.post('https://gdcompanion-prod.onrender.com/atualizar-status-pagamento-cliente', { payment_id: paymentId })
  //   .then(response => {
  //     console.log('Pagamento atualizado com sucesso:', response);
  //     // Tratar a resposta, atualizar o estado do frontend se necessário
  //   })
  //   .catch(error => {
  //     console.error('Erro ao atualizar o pagamento:', error);
  //   });
  // }
  
  useEffect(() => {
    fetchPaymentInfo( /*paymentId ?? '' */).then((info: PaymentInfo) => {
        if (new Date() > new Date(info.expirationDate)) {
            setExpired(true);
            Swal.fire({
                title: 'Expirado!',
                text: 'Esse pagamento expirou.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else {
            setPaymentInfo(info);
        }
    }).catch(error => {
      console.error('Erro ao buscar informações de pagamento:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível buscar as informações de pagamento.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    });
  }, [paymentId]);


  if (expired) {
    return (
      <div className="ccontainer expired-message">
        <img src="/path/to/your/logo.png" alt="Logo" className="logo" />
        <p>Esse pagamento expirou.</p>
      </div>
    );
  }

  return paymentAllInfo ? (
    <>
    <div className="ccontainer">
      <Helmet>
        <title>Making the Payment</title>
      </Helmet>
      <h2 className="ctitle">Fast Payment via Binance</h2>
    

      <div className="c-payment-address">
        {paymentAllInfo.payment_id}
        <h2 style={{ color: '#000000'}}>Transfer Cryptocurrency</h2>
   
        <h4>Name: {String(clientName)}</h4>
        <h4>Service Provided: {String(serviceProvided)}</h4>
        <h4>Payment ID: {String(paymentAllInfo)}</h4>
        <h4>Client ID: {String(clientId)}</h4>
        <h4>Amount <strong>(USDT)</strong>: {String(amount)}</h4>

        {/* <div className="qr-code-binance">
          <img src={qrcodefull_b} alt="qr_code_binance" style={{ cursor: 'pointer' }} />
        </div> */}
      </div>
      <div className='binance-data'>
        <br />
        <img className='binance-logo' src={binance_logo} alt="binance-logo" />
        <h3 className='binance-data-text'>Procced With Binance Pay</h3>
        <h4 className='binance-data-text'>Username: GuerraDone7</h4>
        <h4 className='binance-data-text'>USER ID: {String(binanceUserId)} </h4>
     
        <button className="c-copy-btn" onClick={() => copyToClipboard(binanceUserId)}>
       -- CLICK TO COPY USER ID --
      </button>
      <br /><br />
      <button className='big-button'>
          Mark as DONE
      </button>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
      <h6 className='binance-data-text'>Powered by </h6><img className="binance-wide" src={binance_pay_wide} alt="" />
      </div>
     
      </div>
 
     
    </div>
    </>
  ) : (
    <div className="ccontainer">
      <p>Carregando informações de pagamento...</p>
    </div>
  );
};

export default CryptoPaymentPage;
