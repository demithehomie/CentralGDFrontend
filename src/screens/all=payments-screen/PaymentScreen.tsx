
// import { initMercadoPago } from '@mercadopago/sdk-react'
// initMercadoPago('TEST-9eec9374-8ba1-419b-80e7-295a8c55343c');

import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import { User } from '../../components/user-table/UserTable';
import { useParams } from 'react-router-dom';
import { UserProfileProps } from '../user-profile/UserProfile';


export const mercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com'
});

mercadoPagoApi.interceptors.request.use(async config => {

    const token = `TEST-5220412533742046-011815-1ca564c5f1c0341bab7026692cf1e670-419577621`
   
    const idempotencyKey = `0d5020ed-1af6-469c-ae06-c3bec19954bb`;

    // Correct the header name here
    config.headers['X-Idempotency-Key'] = idempotencyKey;
     config.headers.Authorization = `Bearer ${token}`;
    
   
       return config;
     }
   )
   
   const formReducer = (state: any, event: any) => {
     return {
       ...state,
       [event.name]: event.value
     }
   }

const PaymentScreen : React.FC<UserProfileProps> = ({  }) => {
    const { userId } = useParams<{ userId: string }>();
    const [userData, setUserData] = useState<User | null>(null);

    const [formData, setFormData] = useReducer(formReducer, {})
    const [responsePayment, setResponsePayment] = useState<{ data: any } | null>(null);
    const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState<string | null>(null);
    const [statusPayment, setStatusPayment] = useState<boolean>(false);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3001/users/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }
          const userData = await response.json();
          setUserData(userData);
        } catch (error) {
          console.error((error as any).message);
        }
      };
  
      fetchUser();
    }, [userId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        name: event.target.name,
        value: event.target.value,
      });
    }
    const getStatusPayment = () => {
      const paymentId = responsePayment?.data?.id;
    
      if (paymentId) {
        mercadoPagoApi.get(`v1/payments/${paymentId}`)
          .then(response => {
            if (response.data.status === "approved") {
              // Logic for handling approved payment
              setStatusPayment(true);
            } else {
              // Logic for handling other payment statuses
              console.log(`Payment status: ${response.data.status}`);
            }
          })
          .catch(error => {
            // Logic for handling API call errors
            console.log()
            console.error("Error fetching payment status:", error);
          });
      } else {
        // Logic for handling cases where paymentId is undefined
        console.error("Payment ID is undefined. Cannot fetch payment status.");
      }
    }
    
    
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    
        const body = {
          "transaction_amount": 2,
          "description": "Produto teste de desenvolvimento",
          "payment_method_id": "pix",
          "payer": {
            "email": "leandroguerratool@gmail.com",
            "first_name": "Leandro",
            "last_name": "Guerra",
            "identification": {
              "type": "CPF",
              "number": "10050031732"
            },
           // requestOptions: { idempotencyKey: `0d5020ed-1af6-469c-ae06-c3bec19954bb` }
          },
          "notification_url": "https://eorpjcvcjvhqnq6.m.pipedream.net"
        }
        mercadoPagoApi.post("v1/payments", body ).then(response => {

            setResponsePayment(response)
            console.log(response.data)
            console.log(body)
            setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url)
          }).catch(err => {
            console.log(err)
            //console.log(response)
            console.log(body)
          })
        }
      
   

 
  return (
    <div className="App">
    <div className="App-header">

      <p style={{ color: '#ffffff' }}>
        PIX com API do Mercado pago
      </p>

      <h3 style={{ color: '#ffffff' }}>{userData?.user_id}</h3>

      {
        !responsePayment && <form onSubmit={handleSubmit}>

          <div>
            <label style={{ color: '#ffffff' }}>E-mail</label>
            <input onChange={handleChange} name="email" />
          </div>

          <div>
            <label style={{ color: '#ffffff' }}>Nome</label>
            <input onChange={handleChange} name="nome" />
          </div>

          <div>
            <label style={{ color: '#ffffff' }}>CPF</label>
            <input onChange={handleChange} name="cpf" />
          </div>

          <div>
            <button type="submit">Pagar</button>
          </div>
        </form>
      }

      {responsePayment &&
        <button style={{ color: '#ffffff' }} onClick={getStatusPayment}>Verificar status pagamento</button>
      }

      {
        linkBuyMercadoPago && !statusPayment &&
        < iframe src={linkBuyMercadoPago} width="400px" height="620px" title="link_buy" />
      }

      {
        statusPayment &&
        <h1 style={{ color: '#ffffff' }}>
          Compra Aprovada
        </h1>
      }


    </div>
  </div >
  )
}

export default PaymentScreen
