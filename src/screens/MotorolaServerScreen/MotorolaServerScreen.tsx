import { useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import './MotorolaServerScreen.css';
import Swal from 'sweetalert2';
import { set } from 'date-fns';


export default function MotorolaServerScreen() {

  const [credits, setCredits] = useState('');
  const [server, setServerStatus] = useState('');
  const [randomKey, setRandomKey] = useState('');
  const [unlockKey, setUnlockKey] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://frpbosstool-server.onrender.com/api';
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  


  async function handleLogin() {
    try {
        setLoading(true); // Define o estado de carregamento como verdadeiro
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization', );
        headers.append('Content-Type', 'application/json');
        headers.append('appver', '1.0.0');
        
        const response = await fetch(apiUrl + '/login', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            user: 'guerratool',
            pass: 'GuerratoolAPIaccess!**Pass',
            hwid: 'asd880nf2832nfasd8f23fbas8fasfhwef923a9scd79'
          })
        });
        const data = await response.json(); // Extrai os dados da resposta
        setLoading(false); // Define o estado de carregamento como falso
        setServerStatus(data.server); // Atualiza o estado do servidor
        setCredits(data.credits); // Atualiza os créditos
        console.log('Login Response:', data); // Registra a resposta no console
        // Exibe uma mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Server status and credits retrieved successfully.'
        });
    } catch (error: any) {
        // Em caso de erro, exibe uma mensagem de erro e registra o erro no console
        setLoading(false); // Define o estado de carregamento como falso
        console.error('Error fetching server status:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching server status.'
        });
        // Verifica se há uma resposta de erro e a registra no console, se houver
        if (error.response) {
            console.log('Error response:', error.response);
        }
    }
}


  const handleGetRandomKey = async () => {
      try {
        setLoading(true);
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization', );
        headers.append('Content-Type', 'application/json');
        headers.append('appver', '1.0.0');

          const response = await fetch(`${apiUrl}/getrkey`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                  imei: 'YourIMEI',
                  sn: 'YourSN',
                  model: 'YourModel'
              })
          });
          const data = await response.json();
          setLoading(false);
          setRandomKey(data.rkey);
        } catch (error: any) {
          // Em caso de erro, exibe uma mensagem de erro e registra o erro no console
          setLoading(false); // Define o estado de carregamento como falso
          console.error('Error fetching server status:', error);
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred while fetching server status.'
          });
          // Verifica se há uma resposta de erro e a registra no console, se houver
          if (error.response) {
              console.log('Error response:', error.response);
          }
      }
  };

  const handleGetUnlockKey = async (workid: any, rsadata: any, imei: any, randomkey: any) => {
      try {
          const response = await fetch(`${apiUrl}/getukey`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                  workid: workid,
                  rsadata: rsadata,
                  imei: imei,
                  randomkey: randomkey
              })
          });
          const data = await response.json();
          setUnlockKey(data.ukey);
      } catch (error) {
          console.error('Error fetching unlock key:', error);
      }
  };

  const handlePostStatus = async (workid: any, status: any, imei: any) => {
      try {
          await fetch(`${apiUrl}/postStatus`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                  workid: workid,
                  status: status,
                  imei: imei
              })
          });
      } catch (error) {
          console.error('Error posting status:', error);
      }
  };

    // const goToMotorolaWebSite = () => {
    //     // Abre o website da Motorola em uma nova guia
    //     window.open('https://rsd.cloud.motorola.net/cs/jsp/health/serviceHealthDashboard.jsp', '_blank');
    //   };

  return (
    <>
    <MainNavbar/>
    <MainNavbar />
            <div className='motorola-servers-container'>
                <h1 className='title'>GuerraTool - Servers</h1>
                {/* <hr />
                <h1 className='title'>Other Services</h1>
                <hr />
                <h1 style={{ color: "#ffffff" }}>Motorola Servers</h1>
                <button onClick={goToMotorolaWebSite}>Click Here to Check Motorola Servers Availability</button> */}
                <div>
                    {loading && <p>Loading...</p>}
                    <button onClick={handleLogin}>Login</button>
                    <p>Server Status: {server}</p>
                    <p>Credits: {credits}</p>
                </div>
                {/* <div>
                {loading && <p>Loading...</p>}
                    <button onClick={handleGetRandomKey}>Get Random Key</button>
                    <p>Random Key: {randomKey}</p>
                </div>
                <div>
                    <button onClick={() => handleGetUnlockKey(1, 'rsadata', 'imei', 'randomkey')}>Get Unlock Key</button>
                    <p>Unlock Key: {unlockKey}</p>
                </div>
                <div>
                    <button onClick={() => handlePostStatus(1, 'UNLOCK', 'imei')}>Post Status</button>
                </div> */}
            </div>
  

    </>

  )
}
