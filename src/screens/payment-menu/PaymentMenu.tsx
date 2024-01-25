import { useNavigate } from "react-router-dom";
import './PaymentMenu.css'; // Importando o arquivo CSS

export default function PaymentMenu() {
    const navigate = useNavigate();

    const goToPaymentScreen = async () => {
        navigate('/payment-screen/:userId');
    }

    const showAlert = () => {
        alert('Em breve');
    }

    const goBackToDashboard = () => {
        navigate('/dashboard');
    }

    return (
        <>
            <div className="payment-menu">
                <h1 className="title">Pagamentos</h1>
                <div className="column-of-buttons">
                    <button className='payment-button' onClick={goToPaymentScreen}>Receber Pix</button>
                    <button className='payment-button' onClick={showAlert}>Todos os Pagamentos</button>
                    <button className='payment-button' onClick={showAlert}>Agendar Pagamento</button>
                </div>
                <button className='back-button' onClick={goBackToDashboard}>Voltar ao Início</button>
            </div>
        </>
    );
}
