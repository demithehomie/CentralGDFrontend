import { useNavigate } from "react-router-dom";
import './PaymentMenu.css'; // Importando o arquivo CSS
import MainNavbar from "../../components/main-navbar/MainNavbar";

export default function PaymentMenu() {
    const navigate = useNavigate();

    const goToPaymentScreen = async () => {
        navigate('/payment-screen/execute-action');
    }

    // const showAlert = () => {
    //     alert('Em breve');
    // }

    const goBackToDashboard = () => {
        navigate('/dashboard');
    }

    const goToAllReports = () => {
        navigate('/mgmt-reports');
    }

    const goToReceiveCrypto= () => {
        navigate('/receive-crypto');
    }

    const addSupplier = () => {
        navigate('/add-supplier');
    }

    const addClientManually = () => {
        navigate('/clients/add-manually');
    }

    return (
        <>
        <MainNavbar/>
            <div className="payment-menu">
                <h1 className="title">Central de Pagamentos</h1>
                <br />
                <div className="column-of-buttons">
                    <button className='payment-button' onClick={goToPaymentScreen}>Receber Pix</button>
                    <button className='payment-button' onClick={goToReceiveCrypto}>Receber Crypto</button>
                    {/* <button className='payment-button' onClick={goToPaymentScreen}>Enviar Crypto</button> */}
                    <button className='payment-button' onClick={addSupplier}>Cadastrar Fornecedor</button>

                    <button className='payment-button' style={{ backgroundColor: 'blue', color: "#ffffff"}} onClick={addClientManually}>Cadastrar Cliente Manualmente</button> 
                    <label style={{ backgroundColor: "yellow", borderRadius: 20, fontWeight: "bold"}} >(em fase de testes)</label>
                    <button className='payment-button' onClick={goToAllReports}>Todos os Relatórios</button>
                    {/* <button className='payment-button' onClick={showAlert}>Agendar Pagamento</button> */}
                </div>
                <button className='back-button' onClick={goBackToDashboard}>Voltar ao Início</button>
            </div>
        </>
    );
}
