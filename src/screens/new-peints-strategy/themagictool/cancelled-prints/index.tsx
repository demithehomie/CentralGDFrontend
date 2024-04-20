import { useEffect, useState } from 'react';
import '../index.css';
import MainNavbar from '../../../../components/main-navbar/MainNavbar';
import { useNavigate } from 'react-router-dom';
import { FolderOutline, Person, RefreshOutline } from 'react-ionicons';
import { Spin } from 'antd';
import Swal from 'sweetalert2';
import axios from "axios";

interface User {
    user_id: number; // Adjust type according to your API response
    username: string; // Adjust type according to your API response
}


export default function TheMagictoolPrintsStrategyButJustTheCancelled() {
    const navigate = useNavigate();
    const [guerraToolIDs, setGuerraToolID] = useState<User[]>([]); // Specify type as User[]
    const [guerraToolUser, setGuerraToolUser] = useState<User[]>([]); // Specify type as User[]
    const [loading, setLoading] = useState(false); // State to manage loading state
    
    function searchUser(event: React.ChangeEvent<HTMLInputElement>) {
        const searchTerm = (event.target as HTMLInputElement).value.toLowerCase(); // Convertendo o termo de busca para minúsculas
    
        let foundFirstUser = false; // Flag para controlar se o primeiro usuário foi encontrado
    
        document.querySelectorAll('.user-logic').forEach(user => {
            const titleElement = user.querySelector('#username');
            if (titleElement) {
                const username = titleElement.textContent?.toLowerCase(); // Obtendo o nome do usuário
                // Verificando se o nome do usuário contém o termo de busca
                if (username && username.includes(searchTerm)) {
                    // Se já encontramos o primeiro usuário, saímos do loop
                    if (foundFirstUser) {
                        return;
                    } else {
                        // Mostramos o primeiro usuário encontrado e atualizamos a flag
                        (user as HTMLElement).style.display = 'block';
                        foundFirstUser = true;
                    }
                } else {
                    // Ocultamos os usuários que não correspondem ao filtro
                    (user as HTMLElement).style.display = 'none';
                }
            }
        });
    }
    

    const getAllUsersIDs = async () => {
        try {
            setLoading(true); // Set loading state to true before fetching data
            const response = await fetch('https://gdcompanion-prod.onrender.com/themagictool/screenshots/get-user-ids/hidden');
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


    
    const handleClick = async (userID: number) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Você deseja fazer aparecer novamente os prints deste usuário?',
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
                    const response = await axios.put(`https://gdcompanion-prod.onrender.com/themagictool/hide-or-show-print/${userID}`);
                    
                    // Verifica se a requisição foi bem-sucedida
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'O print voltou a lista visível com sucesso. A página será recarregada agora',
                            icon: 'success',
                            timer: 1500, // 1.5 segundos
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            // Recarrega a página após o timer de 5 segundos
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Erro!', 'Ocorreu um erro ao fazer aparecer novamente o print.', 'error');
                    }
                } catch (error) {
                    console.error('Erro ao ocultar o print:', error);
                    Swal.fire('Erro!', 'Ocorreu um erro ao fazer aparecer novamente o print.', 'error');
                }
            }
        });
    };



    useEffect(() => {
        getAllUsersIDs();
    }, []);

   

    return (
        <>
               {loading && <Spin />} {/* Show spinner while loading */}
            <MainNavbar />
            <div>
                <div>
                    <h1 style={{ color: "#ffffff", paddingTop: 100 }}>Usuários com Prints Ocultados </h1>
                    <h1 style={{ color: "#ffffff"}}> THE MAGIC TOOL</h1>
                    <h3 className='title' style={{ }}>Digite O Nome Do Usuário Ocultado </h3>
                    <h5  style={{ color: '#ffffff'}}>Em seguida, clique para acessar prints específicos</h5>
                 
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <input type="text" className='the-prints-searchbar' placeholder="Digite aqui a sua pesquisa..." onInput={searchUser} />
                        <br />

                        <div className='row-of-buttons-for-prints'>
                        <button style={{ backgroundColor: "dodgerblue", color: "#ffffff", fontWeight: "bold", border: "2px solid #ffffff"}} onClick={() => navigate('/guerratool/new-screen/get-prints/cancelled')}>ACESSAR USUÁRIOS OCULTADOS GUERRATOOL</button>
                        <br />
                        <button onClick={() => window.location.reload()}>
                        <RefreshOutline
                       
                       color={'#ffffff'} 
                       title={"Recarregar"}
                       height="20px"
                       width="20px"
                       />

                            </button>
                        <br />
                        <button onClick={() => navigate('/themagictool/new-screen/get-all-prints')}>
                        <Person
                        color={'#ffffff'} 
                     
                        title={"Person"}
                        height="20px"
                        width="20px"
                        />
                            <Person
                        color={'#ffffff'} 
                     
                        title={"Person"}
                        height="20px"
                        width="20px"
                        />
                             <Person
                        color={'#ffffff'} 
                     
                        title={"Person"}
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
                            <button className="the-user-logic-item" onClick={() => navigate(`/user-prints-page/${guerraToolIDs[index]}`)}>
                                {`Acessar`}
                            </button>
                            <button 
                                className="the-user-logic-item" 
                                style={{ backgroundColor: "green"}} 
                                onClick={() => handleClick(Number(guerraToolIDs[index]))}>
                                {`Tornar Visível`}
                            </button>
                            <br />
                        </div>
                    ))}
                </div>
            </div>
            {/* <h6 className='title' style={{ fontSize: '20px' }}>ID do usuário</h6> */}
        </>
    );
}
