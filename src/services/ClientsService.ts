import axios from 'axios'
const apiurl = `https://gdcompanion-prod.onrender.com`;

const getToken = () => {
    return localStorage.getItem('token'); // Obtém o token do localStorage
  };

  
export async function handleSubmitOfClients(data: any): Promise<void> {
    try {
        const token = getToken(); // Obtendo o token de autenticação
        const controller = new AbortController();
        const response = await axios.post(`${apiurl}/inserir-cliente`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal // Passando o sinal do AbortController para a requisição
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Erro ao cadastrar cliente');
    }
}


export async function getPaymentDetails(paymentId: any) {
    try {
        const token = getToken(); // Obtendo o token de autenticação
        const controller = new AbortController();
        const response = await axios.get(`${apiurl}/mercadopago/payment/check/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal // Passando o sinal do AbortController para a requisição
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao obter detalhes do pagamento');
    }
}
