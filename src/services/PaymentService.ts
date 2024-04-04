// import axios from "axios"


// export const fetchPendingTransfers = async () => {
//     try {
//       // Replace this with your API endpoint to fetch pending transfers
//       const response = await axios.get('https://gdcompanion-prod.onrender.com/pending-transfers-from-clients');
//       if (response.data) {
//         const pendingTransfersData: TransferData[] = response.data;
//         setPendingTransfers(pendingTransfersData);
//         console.log(response.data)
//       }
//     } catch (error) {
//       console.error('Error fetching pending transfers:', error);
//     } finally {
//       setIsLoading(false); // Set loading state to false when data is fetched or if an error occurs
//     }
//   };

export interface UserData {
    user_id: string;
    // Add other properties as needed
  }
  
  export interface TransferData {
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
    credit: number;
    pending_payments: string | boolean;
    setStatusPaymentApproved: boolean;
    created_at: string
    setStatusPaymentPending: (status: boolean) => boolean;
  }