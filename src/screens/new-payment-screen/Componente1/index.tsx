import  { useState } from 'react';
import './index.css';
import MainNavbar from '../../../components/main-navbar/MainNavbar';
import { /*getPaymentDetails,*/ handleSubmitOfClients } from '../../../services/ClientsService';
import Swal from 'sweetalert2';

interface TransferData {
    id: string;
    status: string;
    service_provided: string;
    payment_id: number;
    payment_link: string;
    qr_code: string;
    qr_code_cec: string;
    username: string;
    name: string;
    amount: number;
   // credit: number;
   // pending_payments: string | boolean;
   // setStatusPaymentApproved: boolean;
    created_at: string
   // setStatusPaymentPending: (status: boolean) => boolean;
}

export default function Component1() {
    const id = gerarIdAlfanumerico(5);
    const created_at = new Date().toISOString(); // Convertido para string no formato ISO
    const [formData, setFormData] = useState<TransferData>({
        id: id,
        status: 'pending',
        service_provided: '',
        payment_id: 0,
        payment_link: '',
        qr_code: '',
        qr_code_cec: '',
        username: '',
        name: '',
        amount: 0,
        //credit: 0,
       // pending_payments: '',
       // setStatusPaymentApproved: false,
        created_at: created_at,
       // setStatusPaymentPending: (status: boolean) => false
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'amount' || name === 'payment_id' ? parseFloat(value) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    function gerarIdAlfanumerico(tamanho: number) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        for (let i = 0; i < tamanho; i++) {
          resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
      }

    const handleSubmit = async (e: any) => {
        e.preventDefault();


        

        try {
            setLoading(true); // Ativa o loader
            await handleSubmitOfClients(formData);
            
            setFormData({
                id: id,
                status: 'pending',
                service_provided: '',
                payment_id: 0,
                payment_link: '',
                qr_code: '',
                qr_code_cec: '',
                username: '',
                name: '',
                amount: 0,
                //credit: 0,
               // pending_payments: '',
              // setStatusPaymentApproved: false,
                created_at: created_at,
                //setStatusPaymentPending: (status: boolean) => false
            });
            Swal.fire({
                icon: 'success',
                title: 'Cliente cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            console.log(formData)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar cliente!',
                text: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'
            });
            
        } finally {
            setLoading(false); // Desativa o loader
        }
    };

    // const handlePaymentDetails = async () => {
    //     try {
    //         setLoading(true); // Ativa o loader
    //         const paymentId = formData.payment_id;
    //         if (!paymentId) {
    //             throw new Error('ID do pagamento é obrigatório');
    //         }

    //         const paymentDetails = await getPaymentDetails(paymentId);
    //         // Preencher os campos opcionais com os dados do pagamento
    //         setFormData(prevState => ({
    //             ...prevState,
    //             qr_code: /* paymentDetails.point_of_interaction.transaction_data.qr_code_base64 || */ '',
    //             qr_code_cec: paymentDetails.point_of_interaction.transaction_data.qr_code || '',
    //             payment_link: paymentDetails.point_of_interaction.transaction_data.ticket_url || '',
    //             status: paymentDetails.status || ''
    //         }));
    //         console.log(paymentDetails)
    //     } catch (error) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Erro ao obter detalhes do pagamento!',
    //             text: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'
    //         });
    //     } finally {
    //         setLoading(false); // Desativa o loader independentemente do resultado
    //     }
    // };
      

    return (
        <>
             <MainNavbar />
            <form className="client-form" onSubmit={handleSubmit}>
            <br /><br /><br />
            
            <div style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '50px',
                width: '100px',
                height: '100px',
                alignContent: 'center',
                borderRadius: '50%',
                margin: 'auto'
            }}>1</div>
            
            <br />
            <h3>CADASTRAR CLIENTE</h3>
                <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
                {/* <input type="text" name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} required /> */}
                <input type="text" name="service_provided" placeholder="Serviço Prestado" value={formData.service_provided} onChange={handleChange} required />
                <input type="number" name="amount" placeholder="Valor" value={formData.amount} onChange={handleChange} required />
                {/* <label >Has debt?  </label> */}
                {/* <select
                name="pending_payments"
                id="pending_payments"
                onChange={handleChange}
                value={formData.pending_payments.toString()} // Convertendo para string
            >
                <option value="">Select an Option</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select> */}

                <br />
                <input type="text" name="username" placeholder="Usuário" value={formData.username} onChange={handleChange} />
                {/* <input type="number" name="payment_id" placeholder="ID do Pagamento" value={formData.payment_id} onChange={handleChange} onBlur={handlePaymentDetails} required /> */}


                {/* <h4 > Dados Opcionais </h4>
   

                <input type="text" name="qr_code" hidden placeholder="QR Code" value={formData.qr_code} onChange={handleChange} />
                <input type="text" name="qr_code_cec" placeholder="QR Code CEC" value={formData.qr_code_cec} onChange={handleChange} />
                <input type="text" name="payment_link" placeholder="Link do Pagamento" value={formData.payment_link} onChange={handleChange} />
                <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange} /> */}

                <button type="submit" disabled={loading}>
                    {loading ? <div className="loader" /> : 'Enviar'}
                </button>
            </form>
        </>
    );
}
