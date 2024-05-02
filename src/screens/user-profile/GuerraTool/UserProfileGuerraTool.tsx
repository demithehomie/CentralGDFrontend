import { useEffect, useState } from 'react';
import './UserProfileGuerraTool.css';
// import { useLocation, useParams } from 'react-router-dom';

import {  /*useNavigate , */useParams } from 'react-router-dom';
import { User } from '../../../components/user-table/UserTable';
// import useSendFunctions from '../../personalized-hooks/useSendFunctions';
import axios from 'axios'; 
import MainNavbar from '../../../components/main-navbar/MainNavbar';
import { getToken } from '../../../services/UsersService';

export interface UserProfileProps {
  user?: User;
  onSendCredits?: (amount: number) => void;
  onSendMoney?: (amount: number) => void;
}

const UserProfileGuerraTool: React.FC<UserProfileProps> = ({  }) => {
  //user, onSendCredits, onSendMoney
  //const { handleSendCredits, handleSendMoney } = useSendFunctions(onSendCredits, onSendMoney);
  //const location = useLocation();
  // const navigate = useNavigate()
 // const [creditLogs, setCreditLogs] = useState([]);
 const { userId } = useParams<{ userId: string }>();
 const [userData, setUserData] = useState<User | null>(null);
 const [addAmount, setAddAmount] = useState<string>('');
 const [subtractAmount, setSubtractAmount] = useState<string>('');
 
  const apiurl = `https://gdcompanion-prod.onrender.com`;
 //const apiurldev = `http://localhost:3001`;

 // Função unificada para lidar com operações de crédito
 const handleCreditOperation = async (operationType: string, amount: number, userId: string, _userInfo: string) => {
   try {
     const userInfo = await fetchUserInfo(userId);
     if (!userInfo) {
       console.error('Usuário não encontrado');
       return;
     }
 
     const operationMap = {
       add: {
         url: `${apiurl}/add-credits-guerratool/${userId}`,
         successMessage: 'Credits added successfully',
         logType: 'credit',
         key: 'bycredits',
         source: 'web',
         note: 'Adding credits to account',
         status: 'completed',
         description: 'Credit for purchase',
         action: 'Add',
       },
       subtract: {
         url: `${apiurl}/subtract-credits-guerratool/${userId}`,
         successMessage: 'Credits subtracted successfully',
         logType: 'debit',
         key: 'bycredits',
         source: 'web',
         note: 'Subtracting credits from account',
         status: 'completed',
         description: 'Debit for purchase',
         action: 'Subtract',
       }
     };
 
     const operation = operationMap[operationType as keyof typeof operationMap];
     const response = await axios.put(operation.url, { amount });
     console.log(operation.successMessage, response.data);
 
     // Se a operação foi bem-sucedida, registra a transação
     if (response.data.message && response.data.balance_before !== undefined && response.data.balance_after !== undefined) {
       const logDetails = {
         user_id: userId,
         type: operation.logType,
         key: operation.key,
         source: operation.source,
         credit_cost: amount, // Pode precisar de ajuste baseado na sua lógica de negócios
         credits_qty: amount, // Este campo pode necessitar de ajuste conforme a lógica de negócios
         balance_before: response.data.balance_before,
         balance_after: response.data.balance_after,
         ref_user_id: userInfo.refUserId || userId, // Exemplo, ajuste conforme necessário
         order_id: userInfo.orderId || 0, // Exemplo, ajuste conforme necessário
         note: operation.note,
         status: operation.status,
         Username: userInfo.username || 'user_example', // Usa a informação real do usuário
         Amount_CRD: amount,
         Description: operation.description,
         Action: operation.action,
       };

       try {
         const logResponse = await axios.post(`${apiurl}/guerradone/credit_logs`, logDetails);
         console.log('Log de operação de crédito registrado com sucesso:', logResponse.data);
       } catch (error: unknown) {
         if (error instanceof Error) {
           console.error('Erro ao registrar o log de operação de crédito:', error.message);
         } else {
           console.error('Erro desconhecido');
         }
       }
     } else {
       console.log('Operation did not affect any rows, skipping log entry.');
     }
   } catch (error) {
     console.error('Error in credit operation:', error);
   }
 };
 

 async function fetchUserInfo(userId: string) {
   try {
     const response = await axios.get(`${apiurl}/users/${userId}`);
     return response.data; // Retorna os dados do usuário obtidos
   } catch (error) {
     console.error('Erro ao buscar informações do usuário:', error);
     throw new Error('Falha ao buscar informações do usuário'); // Propaga o erro
   }
 }
 
 // Função modificada para buscar informações do usuário antes da operação
 const handleAddCredits: React.FormEventHandler<HTMLFormElement> = async (event) => {
   event.preventDefault();
   const amountNumber = parseFloat(addAmount);
   if (!isNaN(amountNumber) && userId) {
     try {
       // Busca informações do usuário antes de prosseguir
       const userInfo = await fetchUserInfo(userId); // Assume que userId vem de useParams() ou similar
       await handleCreditOperation('add', amountNumber, userId, userInfo);
     } catch (error) {
       console.error(error);
     }
   } else {
     console.error('Invalid number or missing user ID');
   }
 };
 
 const handleSubtractCredits: React.FormEventHandler<HTMLFormElement> = async (event) => {
   event.preventDefault();
   const amountNumber = parseFloat(subtractAmount);
   if (!isNaN(amountNumber) && userId) {
     try {
       // Busca informações do usuário antes de prosseguir
       const userInfo = await fetchUserInfo(userId); // Assume que userId vem de useParams() ou similar
       await handleCreditOperation('subtract', amountNumber, userId, userInfo);
     } catch (error) {
       console.error(error);
     }
   } else {
     console.error('Invalid number or missing user ID');
   }
 };




 useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;
  const token = getToken()

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: signal
      });
      setUserData(response.data);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  fetchUser();

  return () => {
    controller.abort();
  };
}, [userId]);

 return (
   <>
   <MainNavbar/>

   <div className="user-profile">
   <br /><br /><br />
     <div className="profile-card">
     <br /><br /><br />
     <label className='main-title-color'>Perfil de Usuário</label>
       <div className='new-text-alignment-user-data'>    
      
       {userData && (
         <>
           <p className='title-color'>
             <b>Nome:</b> <br /> {userData.name}
           </p>
           <p className='title-color'>
             <b>Email:</b> <br /> {userData.email}
           </p>
         
         </>
       )}
   </div>
   <hr />
     {/* <div className='row-of-buttons'>
       <button className='row-of-buttons-button' onClick={goToPaymentScreen} >Receber Pagamento</button>
       <button className='row-of-buttons-button'>Todos os Pagamentos</button>
       <button className='row-of-buttons-button'>Agendar Pagamento</button>
     </div> */}

       <hr />

       <div className="actions">
         <div className='new-text-alignment-credit-data'>
           <label className='main-title-color'>Gestão de Créditos</label>
           <p className='title-color'>
             <b>Créditos:</b> {userData && userData.credit}
           </p>
        </div>
           <div>
             <div className='payment-container'>
               <h3 className='title-color-payment'>Adicionar Créditos</h3>
                 <form onSubmit={handleAddCredits}>
                     <label className='title-color'>
                       Quantidade para Adicionar: <br />
                       <input 
                         type="number" 
                         value={addAmount} 
                         onChange={(e) => setAddAmount(e.target.value)} 
                       />
                     </label>
                   <button type="submit" >Adicionar</button>
                 </form>
             </div>
             <br />
             <div className='payment-container'>
               <h3 className='title-color-payment'>Subtrair Créditos</h3>
                 <form onSubmit={handleSubtractCredits}>
                   <label className='title-color'>
                     Quantidade para Subtrair: <br />
                     <input 
                       type="number" 
                       value={subtractAmount} 
                       onChange={(e) => setSubtractAmount(e.target.value)} 
                     />
                     </label>
                     <button type="submit" >Subtrair</button>
                 </form>
             </div>
           </div>
           {/* <br />
           <label>Quantidade:</label>
          
           <br />
           <button type="submit">Enviar</button>
       */}

         {/* <form onSubmit={handleSendMoney}>
           <label>Enviar Dinheiro</label>
           <input type="number" name="amount" placeholder="Insira aqui a quantidade de dinheiro" />
           <button type="submit">Enviar</button>
         </form> */}
       </div>
     </div>
   </div>
   </>
 );
};

export default UserProfileGuerraTool;
