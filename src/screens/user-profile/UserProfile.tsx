import React, { useEffect, useState } from 'react';
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
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [addAmount, setAddAmount] = useState<string>('');
  const [subtractAmount, setSubtractAmount] = useState<string>('');
  
  const apiurldev = `https://gdcompanion-prod.onrender.com`;

  const handleAddCredits = async () => {
    try {
      const response = await axios.put(`${apiurldev}/add-credits/${userId}`, { amount: addAmount  });
      console.log(response.data); // Exiba a resposta do servidor
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSubtractCredits = async () => {
    try {
      const response = await axios.put(`${apiurldev}/subtract-credits/${userId}`, { amount: subtractAmount });
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
  //     const response = await axios.post(`${apiurldev}/update-credits?action=${action}&amount=${amount}`, { action, amount });
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://gdcompanion-prod.onrender.com/users/${userId}`);
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
