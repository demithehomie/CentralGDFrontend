

import axios, { AxiosRequestConfig } from 'axios';

const apiurl = 'https://gdcompanion-prod.onrender.com';

export const getToken = () => {
    return localStorage.getItem('token'); // Obtém o token do localStorage
  };

// Função para criar uma instância de Axios com as configurações necessárias
function axiosInstance(config?: AxiosRequestConfig) {
    const token = getToken(); // Obtendo o token de autenticação
    const controller = new AbortController(); // Criando um AbortController para gerenciar a requisição

    // Configuração padrão para todas as requisições
    const defaultConfig: AxiosRequestConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal // Passando o sinal do AbortController para a requisição
    };

    // Mesclando a configuração padrão com a configuração específica da requisição
    const mergedConfig = { ...defaultConfig, ...config };

    return axios.create(mergedConfig);
}

export function fetchUser(userId: number) {
    return axiosInstance().get(`${apiurl}/users/${userId}`);
}

export function fetchBlockedUsers() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}

export function fetchPaymentAddress() {
    return axiosInstance().get(`${apiurl}/binance-user-id`);
}

export function fetchUsers() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}

export function toggleResellerStatus(userId: number) {
    return axiosInstance().put(`${apiurl}/themagictool/toggle-reseller/${userId}`);
}

export function refreshUsers() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}

export function fetchBlockedUsersGT() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}

export function fetchPaymentAddressGT() {
    return axiosInstance().get(`${apiurl}/binance-user-id`);
}

export function fetchUsersGT() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}

export function toggleResellerStatusGT(userId: number) {
    return axiosInstance().put(`${apiurl}/themagictool/toggle-reseller/${userId}`);
}

export function refreshUsersGT() {
    return axiosInstance().get(`${apiurl}/themagictool/users/blocked`);
}
