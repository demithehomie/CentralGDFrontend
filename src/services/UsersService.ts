import axios from "axios";

export function fetchUser(userId: number) {
    return axios.get(`https://gdcompanion-prod.onrender.com/users/${userId}`);
}

export function fetchBlockedUsers() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}

export function fetchPaymentAddress() {
    return axios.get(`https://gdcompanion-prod.onrender.com/binance-user-id`);
}

export function fetchUsers() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}

export function toggleResellerStatus(userId: number) {
    return axios.put(`https://gdcompanion-prod.onrender.com/themagictool/toggle-reseller/${userId}`);
}

export function refreshUsers() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}

export function fetchBlockedUsersGT() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}

export function fetchPaymentAddressGT() {
    return axios.get(`https://gdcompanion-prod.onrender.com/binance-user-id`);
}

export function fetchUsersGT() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}

export function toggleResellerStatusGT(userId: number) {
    return axios.put(`https://gdcompanion-prod.onrender.com/themagictool/toggle-reseller/${userId}`);
}

export function refreshUsersGT() {
    return axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/blocked`);
}
