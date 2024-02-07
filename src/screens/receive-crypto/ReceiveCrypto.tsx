import { useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import './ReceiveCrypto.css';

export default function ReceiveCrypto() {
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAddress, setReceiveAddress] = useState('');

  const handleSendCrypto = () => {
    // Lógica para enviar criptomoedas via Binance API
    console.log('Enviando criptomoedas...');
  };

  // Função para lidar com o recebimento de criptomoedas
  const handleReceiveCrypto = () => {
    // Lógica para receber criptomoedas via Binance API
    console.log('Recebendo criptomoedas...');
  };


  return (
    <>
    <MainNavbar/>
    <div className="receive-crypto-container">
        <h2>Enviar/Receber Criptomoedas</h2>
        <form className="crypto-form">
          <label htmlFor="sendAmount">Quantidade a ser enviada:</label>
          <input
          className="input"
            type="text"
            id="sendAmount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
          <label htmlFor="receiveAddress">Endereço de recebimento:</label>
          <input
          className="input"
            type="text"
            id="receiveAddress"
            value={receiveAddress}
            onChange={(e) => setReceiveAddress(e.target.value)}
          />
          <div className="button-group">
            <button onClick={handleSendCrypto}>Enviar</button>
            <button onClick={handleReceiveCrypto}>Receber</button>
          </div>
        </form>
      </div>
    </>
  )
}
