import axios from 'axios'
const apiurl = `https://gdcompanion-prod.onrender.com`;


export async function handleSubmitOfClients(data: any): Promise<void> {
    // https://gdcompanion-prod.onrender.com

 

    try {
        const response = await axios.post(`${apiurl}/inserir-cliente`, data)
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.log(error)
        throw new Error('Erro ao cadastrar cliente');
    }

}

export async function getPaymentDetails(paymentId: any) {
    try {
        const response = await axios.get(`${apiurl}/mercadopago/payment/check/${paymentId}`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao obter detalhes do pagamento');
    }
}