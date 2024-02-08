import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

interface PaymentInfo {
    paymentAddress: string;
    expirationDate: string; // ou Date, dependendo de como você quer lidar com datas
    // Adicione outras propriedades conforme necessário
  }
  

const CryptoPaymentPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [expired, setExpired] = useState(false);

  const apiurldev = 'http://localhost:3001';

  const fetchPaymentInfo = async ( /*paymentId: string*/): Promise<PaymentInfo> => {
    // Substitua a URL pela sua API endpoint que retorna as informações do pagamento
    const response = await axios.get(`${apiurldev}/binance-usdt-deposit-address`);
    // if (!response.ok) {
    //   throw new Error('Problema ao buscar informações de pagamento');
    // }
    return response.data;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Copiado!',
        text: 'Endereço de pagamento copiado para a área de transferência.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
    });
  };
  
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

  return paymentInfo ? (
    <div className="ccontainer">
      <h2 className="ctitle">Pagamento com USDT</h2>
      <div className="c-payment-address">
        {paymentInfo.paymentAddress}
        <button className="c-copy-btn" onClick={() => copyToClipboard(paymentInfo.paymentAddress)}>
          Copiar
        </button>
      </div>
      {/* Aqui você pode adicionar mais informações e campos conforme necessário */}
    </div>
  ) : (
    <div className="ccontainer">
      <p>Carregando informações de pagamento...</p>
    </div>
  );
};

export default CryptoPaymentPage;
