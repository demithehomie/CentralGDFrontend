import { useEffect, useState } from 'react';
import './UserProfile.css';
// import { useLocation, useParams } from 'react-router-dom';

import {  /*useNavigate , */useParams } from 'react-router-dom';
import { User } from '../../components/user-table/UserTable';
// import useSendFunctions from '../../personalized-hooks/useSendFunctions';
import axios from 'axios'; 

export interface UserProfileProps {
  user?: User;
  onSendCredits?: (amount: number) => void;
  onSendMoney?: (amount: number) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({  }) => {
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

  const handleCreditOperation = async (operationType: string | number, amount: any) => {
    try {
      const operationMap = {
        add: {
          url: `${apiurl}/add-credits/${userId}`,
          successMessage: 'Credits added successfully',
          logType: 'credit'
        },
        subtract: {
          url: `${apiurl}/subtract-credits/${userId}`,
          successMessage: 'Credits subtracted successfully',
          logType: 'debit'
        }
      };
  
      const operation = operationMap[operationType as keyof typeof operationMap];
      
      // Make the request to add or subtract credits
      const response = await axios.put(operation.url, { amount });
      console.log(operation.successMessage, response.data);
  
      // If the operation was successful, log the transaction
      if (response.data.success) {
        const previousBalance = response.data.balance_before;
        const newBalance = response.data.balance_after;
  
        const logDetails = {
          userId,
          type: operation.logType,
          amount,
          balance_before: previousBalance,
          balance_after: newBalance,
          // Add additional required fields for the log entry
        };
  
        await axios.post(`${apiurl}/guerradone/credit_logs`, logDetails);
      }
    } catch (error) {
      console.error('Error in credit operation:', error);
    }
  };
  
//  const handleAddCredits = () => handleCreditOperation('add', parseFloat(addAmount));
//  const handleSubtractCredits = () => handleCreditOperation('subtract', parseFloat(subtractAmount));
  

  const handleAddCredits = async () => {
    try {
      const responseAddCredits = await axios.put(`${apiurl}/add-credits/${userId}`, { amount: addAmount });
      console.log('Add Amount Response:', responseAddCredits.data);

    handleCreditOperation('add', parseFloat(addAmount));
      // Check the response to decide if the second call should be made
      if (responseAddCredits.data.success) { // Assuming 'success' is a property in your response
        const insertCreditDetails = {
          userId,
          amount: addAmount,
          // Additional data as required by your endpoint
        };
  
        const responseInsertCredits = await axios.post(`${apiurl}/guerradone/credit_logs`, insertCreditDetails);
        console.log('Insert Credits Response:', responseInsertCredits.data);
      } else {
        console.log('Credits not added, skipping insert log.');
      }
    } catch (error) {
      console.error('Error in handleAddCredits:', error);
    }
  };
  
  
  const handleSubtractCredits = async () => {
    try {
      const response = await axios.put(`${apiurl}/subtract-credits/${userId}`, { amount: subtractAmount });
      handleCreditOperation('subtract', parseFloat(subtractAmount));
      console.log(response.data); // Exiba a resposta do servidor
    } catch (error) {
      console.error(error);
    }
  };
 

//   const  goToPaymentScreen  = async () => {
//   navigate('/payment-screen/:userId')
// }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //   try {
  //     const response = await axios.post(`${apiurl}/update-credits?action=${action}&amount=${amount}`, { action, amount });
  //     console.log(response.data); // Exiba a resposta do servidor
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Verificar a ação selecionada (add ou subtract) e chamar a função apropriada
  //   if (action === 'add') {
  //     handleSendCredits(amount);
  //   } else if (action === 'subtract') {
  //     handleSendCredits(-amount); // Passar um valor negativo para subtrair
  //   }
  // };

  // if (!response.ok) {
  //   throw new Error('Failed to fetch user');
  // }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://gdcompanion-prod.onrender.com/users/${userId}`);
        console.log(userId)
     
          setUserData(response.data);
      } catch (error) {
        console.error((error as Error).message);
      }
    };
  
    fetchUser();
  }, [userId]);

  return (
    <>
    <div className="user-profile">
   
      <div className="profile-card">
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

export default UserProfile;
