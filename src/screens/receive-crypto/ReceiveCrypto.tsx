import { useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import Swal from 'sweetalert2';
import './ReceiveCrypto.css';

export default function ReceiveCrypto() {
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAddress, setReceiveAddress] = useState('');
  const handleSendCrypto = () => {
    // Lógica para enviar criptomoedas via Binance API
    // Substitua o console.log por um alerta do SweetAlert
    Swal.fire({
      title: 'Sucesso!',
      text: 'Criptomoedas enviadas com sucesso.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  };
  
  const handleReceiveCrypto = () => {
    // Lógica para receber criptomoedas via Binance API
    // Substitua o console.log por um alerta do SweetAlert
    Swal.fire({
      title: 'Sucesso!',
      text: 'Criptomoedas recebidas com sucesso.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  };

  return (
    <>
    <MainNavbar/>
    <div className="receive-crypto-container">
        <h2>Enviar/Receber Criptomoedas</h2>
        <form className="crypto-form">
          <label className="label" htmlFor="sendAmount">Quantidade a ser enviada:</label>
          <input
          className="input"
            type="text"
            id="sendAmount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
          <label className="label" htmlFor="receiveAddress">Endereço de recebimento:</label>
          <input
          className="input"
            type="text"
            id="receiveAddress"
            value={receiveAddress}
            onChange={(e) => setReceiveAddress(e.target.value)}
          />
          <div className="rc-button-group">
            <button className="rc-button" onClick={handleSendCrypto}>Enviar</button>
            <button className="rc-button" onClick={handleReceiveCrypto}>Receber</button>
          </div>
        </form>
      </div>
    </>
  )
}
