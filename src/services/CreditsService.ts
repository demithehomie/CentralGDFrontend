import axios, { AxiosRequestConfig } from "axios";

const apiurl = "https://gdcompanion-prod.onrender.com";

// Função para obter o token de autenticação
const getToken = () => {
    return localStorage.getItem('token'); // Obtém o token do localStorage
};

// Função para criar uma instância de Axios com as configurações necessárias
function axiosInstance(config?: AxiosRequestConfig) {
    const token = getToken(); // Obtendo o token de autenticação
    const controller = new AbortController(); // Criando um AbortController para gerenciar a requisição

    // Configuração padrão para todas as requisições
    const defaultConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal, // Passando o sinal do AbortController para a requisição
    };

    // Mesclando a configuração padrão com a configuração específica da requisição
    const mergedConfig = { ...defaultConfig, ...config };

    return axios.create(mergedConfig);
}

export function fetchLogsGT(page: number, pageSize: number) {
    return axiosInstance().get(`${apiurl}/guerratool/credit_logs_with_pagination?page=${page}&limit=${pageSize}`);
}

export function fetchLogs(page: number, pageSize: number) {
    return axiosInstance().get(`${apiurl}/guerradone/credit_logs_with_pagination?page=${page}&limit=${pageSize}`);
}

export function handleSendCredits(amount: number) {
    return axiosInstance().post(`${apiurl}/update-credits?action=add&amount=${amount}`);
}

export function handleAddCredits(userId: number, addAmount: number) {
    return axiosInstance().put(`${apiurl}/add-credits/${userId}`, { amount: addAmount });
}

export function handleSubtractCredits(userId: number, subtractAmount: number) {
    return axiosInstance().put(`${apiurl}/subtract-credits/${userId}`, { amount: subtractAmount });
}
