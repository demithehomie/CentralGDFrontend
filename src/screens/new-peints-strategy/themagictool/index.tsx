import { useEffect, useRef, useState } from 'react';
import './index.css';
import MainNavbar from '../../../components/main-navbar/MainNavbar';
import { useNavigate } from 'react-router-dom';
import { EyeOffOutline, FolderOutline, RefreshOutline } from 'react-ionicons';
import { Spin } from 'antd';
import Swal from 'sweetalert2';
import axios from "axios";

import tmtlogo from '../../../assets/tmttttt.png'

interface User {
    user_id: number; // Adjust type according to your API response
    username: string; // Adjust type according to your API response
}


export default function TheMagictoolPrintsStrategy() {

    const inputRef = useRef<HTMLInputElement>(null); // Referência para o input
    const navigate = useNavigate();
    const [guerraToolIDs, setGuerraToolID] = useState<User[]>([]); // Specify type as User[]
    const [guerraToolUser, setGuerraToolUser] = useState<User[]>([]); // Specify type as User[]
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [inputValue, setInputValue] = useState<string>('');
    const [deleting, setDeleting] = useState(false);
    const [showLoader, setShowLoader] = useState(false); // State to control Swal with loader

    

    useEffect(() => { // DONE ?
        const timeoutId = setTimeout(() => {
          if (inputRef.current) {
            const fakeEvent = { target: { value: inputRef.current.value.trim() } } as React.ChangeEvent<HTMLInputElement>;
            searchUser(fakeEvent);
          }
        }, 1000);
      
        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
      }, []);

    // useEffect(() => {
    //     const fakeEvent = {} as React.ChangeEvent<HTMLInputElement>; // Criar um evento vazio
    //     searchUser(fakeEvent);
    // }, [inputValue]);
    

    
    async function searchUser(event: React.ChangeEvent<HTMLInputElement>) {
        const searchTerm = event.target.value.toLowerCase(); // Convertendo o termo de busca para minúsculas
    
        // Verificando se há um valor no input
        if (searchTerm.trim() === '') {
            // Se o input estiver vazio, exiba todos os usuários novamente
            document.querySelectorAll('.user-logic').forEach(user => {
                (user as HTMLElement).style.display = 'block';
            });
            return; // Sai da função, pois não há necessidade de continuar
        }
    
        // Percorre todos os usuários e verifica se o nome do usuário contém o termo de busca
        document.querySelectorAll('.user-logic').forEach(user => {
            const titleElement = user.querySelector('#username');
            if (titleElement) {
                const username = titleElement.textContent?.toLowerCase(); // Obtendo o nome do usuário
                // Verificando se o nome do usuário contém o termo de busca
                if (username && username.includes(searchTerm)) {
                    // Se o nome do usuário corresponder, exiba o usuário
                    (user as HTMLElement).style.display = 'block';
                } else {
                    // Se o nome do usuário não corresponder, oculte o usuário
                    (user as HTMLElement).style.display = 'none';
                }
            }
        });
    }
    
          // Função para atualizar o valor do localStorage sempre que o valor do input mudar
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    localStorage.setItem('inputValue', value);
  };

  const getToken = () => {
    return localStorage.getItem('token'); // Obtém o token do localStorage
  };

  useEffect(() => { // DONE ?
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllUsersIDs = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching data
        const token = getToken()
        const response = await fetch('https://gdcompanion-prod.onrender.com/themagictool/screenshots/get-all-user-ids', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal // Passando o sinal do AbortController para a opção de sinal do fetch
        });

        if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
        }

        const data = await response.json();
        const userIDs = data.map((user: { user_id: any; }) => user.user_id);
        const usernames = data.map((user: { username: any; }) => user.username);
        setGuerraToolID(userIDs);
        setGuerraToolUser(usernames);
        console.log('Conteúdo de data:', userIDs);
        return userIDs;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading state to false after fetching data (whether successful or not)
      }
    };

    getAllUsersIDs();

    return () => {
      abortController.abort(); // Cancelar a solicitação quando o componente for desmontado
    };
  }, []);

  const token = getToken()

    const handleClick = async (userID: number) => {
        setDeleting(true); // Inicia o estado de carregamento
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Você deseja ocultar o print deste usuário?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Faz a requisição para ocultar o print
                    const response = await axios.put(
                        `https://gdcompanion-prod.onrender.com/themagictool/hide-or-show-print/${userID}`,
                        null, // O segundo parâmetro é o corpo da solicitação, que é nulo neste caso
                        {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        }
                      );
                      
                    
                    // Verifica se a requisição foi bem-sucedida
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'O print foi ocultado com sucesso. A página será recarregada agora.',
                            icon: 'success',
                            timer: 1500, // 5 segundos
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            // Recarrega a página após o timer de 5 segundos
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Erro!', 'Ocorreu um erro ao ocultar o print.', 'error');
                    }
                } catch (error) {
                    console.error('Erro ao ocultar o print:', error);
                    Swal.fire('Erro!', 'Ocorreu um erro ao ocultar o print.', 'error');
                }
            }
        });
    };



   const handleDelete = async (userID: any) => {
    
    setDeleting(true); 
    Swal.fire({
        title: 'Você tem certeza?',
        text: 'Você deseja deletar o print deste usuário?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                setShowLoader(true);
                // Faz a requisição para deletar o print
    ////////////////////
    ////////////////
    /////////////// DELETAR PRIINT
    /////////////
    ////////////
                const firstResponse = await axios.delete(`https://gdcompanion-prod.onrender.com/themagictool/prints-deletion/definitive/delete-them-all/${userID}`,
               
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              )

             
                // Verifica se a requisição foi bem-sucedida
                if (firstResponse.status === 200) {
                    setShowLoader(false);
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'O print foi deletado com sucesso. A página será recarregada agora.',
                        icon: 'success',
                        timer: 7000, // 5 segundos
                        timerProgressBar: true,
                        showConfirmButton: true
                    }).then(() => {
                        Swal.fire({
                            title: 'Atenção!',
                            text: '[AUTOMAÇÃO EM ANDAMENTO] - É necessário apagar os targets, ou o usuário aparecerá novamente na lista. Se voltou a aparecer, apague os targets relacionados ao usuário em questão e tente novamente,',
                            icon: 'warning',
                            timer: 7000, // 5 segundos
                            timerProgressBar: true,
                            showConfirmButton: true
                        }).then(() => {
                        // Recarrega a página após o timer de 5 segundos
                        window.location.reload();
                        });
                    });
                } else {
                    Swal.fire('Erro!', 'Ocorreu um erro ao deletar o print.', 'error');
                    setShowLoader(false);
                }
                setShowLoader(false);
            } catch (error) {
                console.error('Erro ao deletar o print:', error);
                Swal.fire('Erro!', 'Ocorreu um erro ao deletar o print.', 'error');
                setShowLoader(false);
            }
        }
        setShowLoader(false);
    });
    setDeleting(false); // Finaliza o estado de carregamento
   
   }

   useEffect(() => {
    if (showLoader) {
      Swal.fire({
        title: 'Carregando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        showCancelButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();
    }
  }, [deleting]);

  useEffect(() => {
    // Ocultar o loader quando a exclusão for concluída
    if (!deleting) {
      setShowLoader(false);
    }
  }, [deleting]);
   

    return (
        <>
       


               {loading && <Spin />} {/* Show spinner while loading */}
            <MainNavbar />
          
                <div>
                  <br /><br /><br />
                  <h2 style={{ color: "#ffffff", fontSize: 35 }}>Acesso aos Prints </h2>
                  <img src={tmtlogo} alt="tmtlogo" className='tmt-logo-bro'/>
                   
                 <br /><br />
         
                 
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <input 
                        ref={inputRef}
                            type="text" 
                            className='the-prints-searchbar' 
                            placeholder="Digite O Nome Do Usuário..." 
                            onInput={searchUser} 
                            value={inputValue} 
                            onChange={handleInputChange} 
                            onLoad={searchUser}
                            />
                       
                        <br /><br />

                        <div className='row-of-buttons-for-prints'>
                        <button style={{ backgroundColor: "#006400", color: "#ffffff", fontWeight: "bold", border: "2px solid #ffffff"}} onClick={() => navigate('/guerratool/new-screen/get-all-prints')}>ACESSAR PRINTS DO GUERRATOOL</button>
                        <br />
                        <button onClick={() => window.location.reload()}>
                            REGARREGAR CONTEÚDO{" "}
                            <RefreshOutline
                                color={'#ffffff'} 
                                title={"Recarregar"}
                                height="20px"
                                width="20px"
                                />
                            </button>
                        <br />
                        <button  onClick={() => navigate('/themagictool/new-screen/get-prints/cancelled')}>
                            ACESSAR USUÁRIOS OCULTADOS{" "}
                            <EyeOffOutline
                                color={'#ffffff'} 
                                title={"Recarregar"}
                                height="20px"
                                width="20px"
                                />
                            </button>
                        </div>
                    </div>

                    

                
                </div>
                <div className='user-logic-container'>
                {guerraToolUser.map((username, index) => (
                        <div key={index} className='user-logic'>
                            <FolderOutline
                                color={'#ffffff'}
                                title={"folder-icon"}
                                height="50px"
                                width="50px"
                            />
                            {/* Displaying the username */}
                            <p id="username" className='title the-user-logic-item' onClick={() => navigate(`/user-prints-page/${guerraToolIDs[index]}`)}>
                                Nome de usuário: <strong>{String(username)}</strong>
                            </p>
                            <br />
                            {/* Displaying the user ID */}
                            <p  className='title'>ID do usuário: <strong>{guerraToolIDs[index].toString()}</strong></p>
                            <br />

                            <div className='new-row-of-buttons' >

                            <button 
                                className="the-user-logic-item" 
                                onClick={() => navigate(`/user-prints-page/${guerraToolIDs[index]}`)}>
                                {`Acessar`}
                            </button>

                            <button 
                                className="the-user-logic-item" 
                                style={{ backgroundColor: "red"}} 
                                onClick={() => handleClick(Number(guerraToolIDs[index]))}>
                                {`Ocultar`}
                            </button>

                            <button
                              className="the-user-logic-item" 
                              style={{ backgroundColor: "yellow", color: "black", fontWeight: "bold"}} 
                              onClick={() => handleDelete(Number(guerraToolIDs[index]))}
                            >
                                {`Apagar`}
                            </button>

                            </div>

                            <br />
                        </div>
                    ))}
                </div>
            
            {/* <h6 className='title' style={{ fontSize: '20px' }}>ID do usuário</h6> */}
        </>
    );
}
