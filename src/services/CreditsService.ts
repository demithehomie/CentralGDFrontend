import axios from "axios";




export function fetchLogsGT(page: number, pageSize: number) {
    return axios.get(`https://gdcompanion-prod.onrender.com/guerratool/credit_logs_with_pagination?page=${page}&limit=${pageSize}`);
}

export function fetchLogs(page: number, pageSize: number) {
    return axios.get(`https://gdcompanion-prod.onrender.com/guerradone/credit_logs_with_pagination?page=${page}&limit=${pageSize}`);
}


export function handleSendCredits(amount: number) {
    return axios.post(`https://gdcompanion-prod.onrender.com/update-credits?action=add&amount=${amount}`);
}

export function handleAddCredits(userId: number, addAmount: number) {
    return axios.put(`https://gdcompanion-prod.onrender.com/add-credits/${userId}`, { amount: addAmount });
}

export function handleSubtractCredits(userId: number, subtractAmount: number) {
    return axios.put(`https://gdcompanion-prod.onrender.com/subtract-credits/${userId}`, { amount: subtractAmount });
}


