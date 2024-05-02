import './UserPrintsNoID.css'

import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Modal from 'react-modal';
import 'react-image-gallery/styles/css/image-gallery.css'; // Importando o estilo padrão do react-image-gallery

import Loader from '../../../components/loader/Loader';
import FloatingButtons from '../../../components/floating-button/FloatingButton';
import MainNavbar from '../../../components/main-navbar/MainNavbar';
import { FolderOpenOutline } from 'react-ionicons';
const itemsPerPage: number = 1;
import ImageGallery from 'react-image-gallery';
import { getToken } from '../../../services/UsersService';


Modal.setAppElement('#root');

interface UserPrintsPageNOIDProps {
  // Define any necessary props here
}

interface Print {
  id: number;
  file_name: string;
  created_at: string;
}

const UserPrintsPageNOID: React.FC<UserPrintsPageNOIDProps> = () => {
  const navigate = useNavigate();
 
  const [_hasMore, setHasMore] = useState<boolean>(true);
    const [_totalPrints, _setTotalPrints] = useState<number>(0);
    const [isFullSizeModalOpen, setIsFullSizeModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Adicione o estado isLoading
    const { userId } = useParams<{ userId: string }>();
   // const [_user, setUser] = useState<any>({});
    const [userPrints, setUserPrints] = useState<Print[]>([]);
    const [currentPage, _setCurrentPage] = useState<number>(1);
    // const itemsPerPage: number = 15;
    const [selectedImage, _setSelectedImage] = useState<string | null>(null);
    const [_inputPage, _setInputPage] = useState<number>(currentPage);
    
    // const openFullSizeModal = () => {
    //   setIsFullSizeModalOpen(true);
    // };

    const handleClickVoltar = () => {
      navigate(-1); // Navegar uma página para trás no histórico
    };
  
    const closeFullSizeModal = () => {
      setIsFullSizeModalOpen(false);
    };

    const token = getToken()
  
    const fetchMorePrints = async (
      //  userId: any, 
        _threeDaysAgo: any, 
        _today: any, 
     //   currentPage: any, 
       // itemsPerPage: any, 
        token: any
    ) => {
      const controller = new AbortController();
      const signal = controller.signal;
  
      setIsLoading(true);
      try {
          const config = {
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              signal: signal
          };
  
          const response = await axios.get(`https://gdcompanion-prod.onrender.com/themagictool/screenshots/users-with-no-ids`, config);
  
          setUserPrints((prevPrints) => [...prevPrints, ...response.data]);
          setHasMore(response.data.length >= itemsPerPage);
      } catch (error) {
          if (axios.isCancel(error)) {
              console.log('Solicitação cancelada:', error.message);
          } else {
              console.error('Erro ao buscar mais prints do usuário:', error);
          }
      } finally {
          setIsLoading(false);
      }
  };
  
  // Função para cancelar a solicitação se necessário
  // const cancelRequest = () => {
  //     controller.abort();
  // };

    const today = new Date().toISOString().split('T')[0]; // Data de hoje
    const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0]; // Dez dias atrás
  
    useEffect(() => {
      // const today = new Date().toISOString().split('T')[0]; // Data de hoje
      // const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0]; // Dez dias atrás
  
      fetchMorePrints( threeDaysAgo,  today, /* currentPage, itemsPerPage, */ token );
    }, [userId, currentPage]);


  const images = userPrints.map((print) => ({
    original: `https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`,
    thumbnail: `https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`,
    description: `Criado em ${formatDate(print.created_at)}`,
  }));

//   const getUserById = async (userId: string) => {
//     try {
//       const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setUser(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user by id:', error);
//     }
//   }

//   useEffect(() => {
//     if (userId) {
//       getUserById(userId).then((user) => {
//         console.log(`User: ${JSON.stringify(user)}`);
//       });
//     }
//   }, [userId]);

  // const totalPages = Math.ceil(totalPrints / itemsPerPage);

  // const paginate = (items: Print[], currentPage: number, itemsPerPage: number) => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return items.slice(startIndex, endIndex);
  // };

  // const paginatedUserPrints = paginate(userPrints, currentPage, itemsPerPage);

  // const openImageModal = (imageSrc: string) => {
  //   setSelectedImage(imageSrc);
  // };

  const backToDashboard = () => {
    navigate('/familiaguerra/all-new-dashboard');
  };

  const getAllPrintsTheMagicTool = () => {
    navigate('/guerratool/new-screen/get-all-prints');
  };

//   const closeImageModal = () => {
//     setSelectedImage(null);
//   };

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', // ou '2-digit'
    month: '2-digit', // ou 'numeric'
    day: '2-digit', // ou 'numeric'
    hour: '2-digit', // ou 'numeric'
    minute: '2-digit', // ou 'numeric'
    hour12: false
  };
  
  // Cria um objeto de data com base na string fornecida
  let date = new Date(dateString);
  
  // Ajusta a data adicionando 3 horas para compensar o fuso horário

  date = new Date(date.getTime() + (3 * 60 * 60 * 1000)); // Adiciona 3 horas

  // Utiliza o fuso horário local para a formatação
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}


// O restante do componente permanece o mesmo



  return (
    <div>
      <MainNavbar/>
      <br /><br /><br /><br /><br /><br />
      <FloatingButtons/>
    <h2 style={{ color: '#ffffff' }}>

                          <FolderOpenOutline
                            color={'#ffffff'} 
                            title={"folder-icon"}
                            height="25px"
                            width="50px"
                            /> 
      
                            Pasta de prints de usuários sem id
      
    </h2>
    
    {isLoading ? (
      <Loader />
    ) : (
      <div className="carousel-container">
       {/* <Carousel
  showThumbs={false}
  showStatus={false}
  dynamicHeight={true}
  showIndicators={true}
  className="custom-carousel"
>
  {userPrints.length > 0 ? userPrints.map((print: Print) => (
    <div
      key={print.id}
      className="carousel-item"
      onClick={() => {
        setSelectedImage(`https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${print.file_name}`);
        openFullSizeModal();
      }}
    >
      <h3>Criado em {formatDate(print.created_at)}</h3>
      <img
        src={`https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${print.file_name}`}
        alt={print.file_name}
        className="carousel-image"
        title={print.created_at}
      />

     
    </div>
  )) : [<p key="no-prints">No prints available.</p>]}
</Carousel> */}


      <ImageGallery 
        items={images} 
        lazyLoad={true}
        additionalClass="custom-image-gallery" // Adicionando uma classe adicional para estilização personalizada
        thumbnailPosition="left" // Posicionando as miniaturas à esquerda
        autoPlay={false} // Definindo autoPlay como false para desativar o autoplay
        showPlayButton={false} // Ocultando o botão de autoplay
        showNav={true} // Exibir navegação entre as miniaturas
        showThumbnails={true} // Exibir miniaturas
// showBullets={true}
        />

      </div>
    )}
      <Modal
        isOpen={isFullSizeModalOpen}
        onRequestClose={closeFullSizeModal}
        contentLabel="Imagem em Tela Cheia"
        appElement={document.getElementById('root') || undefined}
        className="modal"
        overlayClassName="overlay"
      >
  <div className="modal-content">
    <button onClick={closeFullSizeModal} className="close-button">
      Fechar
    </button>
    {selectedImage && (
      <>
        <a
          href={selectedImage}
          target="_blank"
          rel="noopener noreferrer"
          className="open-in-new-tab-button"
        >
          Abrir em Nova Guia
        </a>
        <img
          src={selectedImage}
          alt="Imagem em Tela Cheia"
          className="modal-image"
        />
      </>
    )}
  </div>
</Modal>

<br /><br />
<div>


<div className="pagination">
      {/* <button
        className="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        Primeira Página
      </button>
      <button
        className="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Anterior
      </button> */}
      {/* <div className='labels-and-inputs'>
      <span style={{ color: '#ffffff'}}> {currentPage} de {totalPages}</span>
      <input
        type="number"
        value={inputPage}
        onChange={handleInputPageChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            if (inputPage >= 1 && inputPage <= totalPages) {
              setCurrentPage(inputPage);
            }
          }
        }}
      />
      </div> */}
      {/* <button
        className="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Próxima
      </button>


      <button
        className="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        Última Página
      </button> */}
        <br />
        <br />
        <div>
        {/* <button className="button" onClick={backToDashboard}>Voltar ao Início</button> */}
        </div>
      
    
      </div>

      <div className='navigation'>
      <button className='button' style={{ backgroundColor: '#ffffff' }} onClick={handleClickVoltar}>Voltar</button>
        <button className="button" onClick={getAllPrintsTheMagicTool}>Voltar para Todos os Prints</button>
        <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
      </div>

    </div>


    </div>
  );
};

export default UserPrintsPageNOID;
