import{ useState } from 'react';
import './PopupForm.css'; // Arquivo CSS para estilos
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const PopupForm = ({ updateAmount, closePopup }: { closePopup: any, updateAmount: any }) => {
    const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [amount, setAmount] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    service_provided: '',
    amount: 0,
    pending_payments: true,
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      // Preparar os dados para serem enviados
      const data = {
        name: formData.name,
        whatsapp: formData.whatsapp,
        service_provided: formData.service_provided,
        amount: formData.amount,
        // pending_payments é sempre true, então não precisa ser enviado
      };

      // Fazer a requisição POST para o endpoint
      const response = await axios.post('https://gdcompanion-prod.onrender.com/inserir-cliente', data);

      console.log('Resposta do servidor:', response.data);
      closePopup();
      setShowPopup(false); // Fecha o popup após o envio bem-sucedido
      // Aqui você pode adicionar qualquer lógica adicional após o envio bem-sucedido
    } catch (error) {
      console.error('Erro ao enviar os dados do cliente', error);
      // Aqui você pode tratar o erro, por exemplo, exibindo uma mensagem para o usuário
    }
  };

  const navigateToPaymentMenu = () => {
    navigate('/payments');
}

const handleAmountUpdate = () => {
    // Supondo que 'amount' é um estado no PopupForm
    updateAmount(amount);
    closePopup();
  };

  return (
    <div>
        <br />
      <button onClick={() => setShowPopup(true)}>Abrir Formulário</button>

      {showPopup && (
        <div className="popup-background">
            
          <div className="popup-container">
     
            <form onSubmit={handleSubmit}>
                <h4>Iniciando PIX</h4>
                <h5>Preencha com os dados do Cliente que recebrá a cobrança.</h5>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome"
              />
              <br />
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp"
              />
              <br />
              <input
                type="text"
                name="service_provided"
                value={formData.service_provided}
                onChange={handleChange}
                placeholder="Serviço Fornecido"
              />
              <br />
              <input
           
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Valor"
              />
               <input
                hidden
                type="text"
                name="pending_payments"
                value={"true"}
                onChange={handleChange}
                placeholder="Valor"
                />
              <br /><br />
              {/* <button type="submit" onClick={() => setShowPopup(false)}>Iniciar Pagamento</button> */}
              <br /><br />
              <button type="button" onClick={handleAmountUpdate}>Atualizar Valor e Fechar</button>
            {/* <button type="button" onClick={() => { setShowPopup(false); navigateToPaymentMenu(); }}>Cancelar</button> */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
