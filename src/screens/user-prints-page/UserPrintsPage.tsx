import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import 'react-image-gallery/styles/css/image-gallery.css'; 
import './UserPrintsPage.css';
import Loader from '../../components/loader/Loader';
import FloatingButtons from '../../components/floating-button/FloatingButton';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { FolderOpenOutline } from 'react-ionicons';
const itemsPerPage: number = 1;
import ImageGallery from 'react-image-gallery';
import { getToken } from '../../services/UsersService';
import onError from  '../../assets/404.png';
import { CustomNavigationFloatingButton } from '../../components/prints-page-floating-button';
import { FaListAlt } from "react-icons/fa";



Modal.setAppElement('#root');

interface UserPrintsPageProps {
  // Define any necessary props here
}

interface Print {
  id: number;
  file_name: string;
  created_at: string;
  reason: string;
  details: string;
  public: number;
  fingerprint: string;
}

const UserPrintsPage: React.FC<UserPrintsPageProps> = () => {
  const navigate = useNavigate();
 
  const [hasMore, setHasMore] = useState<boolean>(true);
    const [_totalPrints, _blanksetTotalPrints] = useState<number>(0);
    const [isFullSizeModalOpen, setIsFullSizeModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Adicione o estado isLoading
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<any>({});
    const [userPrints, setUserPrints] = useState<Print[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    //const itemsPerPage: number = 1;
    const [selectedImage, _setSelectedImage] = useState<string | null>(null);
    const [_inputPage, _setInputPage] = useState<number>(currentPage);
    const [_errorPrints, setErrorPrints] = useState<string>('');
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [isDeletingPrints, setIsDeletingPrints] = useState<boolean>(false);
    const [deleting, _setDeleting] = useState(false);
    const [showLoader, setShowLoader] = useState(false); // State to control Swal with loader


    function formatDate(dateString: string) {
      console.log(`DATA STRING ${dateString}`);
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
      console.log(`QUE ISSO? ${new Intl.DateTimeFormat('pt-BR', options).format(date)}`)
      return new Intl.DateTimeFormat('pt-BR', options).format(date);
    }

    const handleClickVoltar = () => {
      navigate(-1); // Navegar uma página para trás no histórico
    };

    // const openFullSizeModal = () => {
    //   setIsFullSizeModalOpen(true);
    // };
  
    const closeFullSizeModal = () => {
      setIsFullSizeModalOpen(false);
    };

    // const handleInputPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const newPage = parseInt(event.target.value);
    //   setInputPage(newPage);
    // };
  
    const token = getToken()
  
    const fetchMorePrints = async (userId: any, itemsPerPage: any, token: any) => {
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
  
          const response = await axios.get(`https://gdcompanion-prod.onrender.com/themagictool/get-all-prints/with-new-pagination/${userId}`, config);
  
          // Filter out any errors (404 or otherwise) from$@$v=v1.16$@$the response data
    const filteredPrints = response.data.filter((print: any) => print.status !== 'error');

    setUserPrints((prevPrints) => [...prevPrints, ...filteredPrints]);
    setHasMore(filteredPrints.length >= itemsPerPage);
    console.log(userPrints)
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

    useEffect(() => {
      fetchMorePrints(userId,  itemsPerPage, token);
    }, [userId, currentPage]);

    
    const images = userPrints.map((print) => ({
      original: `https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`,
      thumbnail: `https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`,
      description: `Criado em ${formatDate(print.created_at)}`,
    }));

  const getUserById = async (userId: string) => {
    try {
      const response = await axios.get(`https://gdcompanion-prod.onrender.com/themagictool/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserById(userId).then((user) => {
        console.log(`User: ${JSON.stringify(user)}`);
      });
    }
  }, [userId]);



  const backToDashboard = () => {
    navigate('/familiaguerra/all-new-dashboard');
  };

  const getAllPrintsTheMagicTool = () => {
    navigate('/themagictool/new-screen/get-all-prints');
  };


  const fetchErrorPrints = async (userId: any, token: any) => {
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
  
      const response = await axios.get(`https://gdcompanion-prod.onrender.com/themagictool/get-all-prints/with-new-pagination/${userId}`, config);
  
      // Filter out any prints with rendering errors
      const errorPrints = response.data.filter((print: any) => print.status === 'rendering_error');
  
      // Filter out any prints without rendering errors
      const validPrints = response.data.filter((print: any) => print.status !== 'rendering_error');
  
      setUserPrints((prevPrints) => [...prevPrints, ...validPrints]);
      setHasMore(validPrints.length >= itemsPerPage);
      setErrorPrints(errorPrints);
      console.log(errorPrints)
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
  
  
  
  const deletePrintsDefinitive = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    
  
    try {
      setShowLoader(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: signal
      };
  
      // Construir a string da query para a primeira solicitação
      const queryStringFirst = `?filename=${userPrints[currentSlideIndex].file_name}&path=/THEMAGICT_2102255/`;
  
      // First, delete prints definitively with query string
      const firstResponse = await axios.delete(`https://gdcompanion-prod.onrender.com/themagictool/prints-deletion/definitive/${userId}${queryStringFirst}`, config);
  
      // Check if deletion was successful
      if (firstResponse.status === 200) {
       
        // Then, sanitize any remaining prints
        const secondResponse = await axios.delete(`https://gdcompanion-prod.onrender.com/themagictool/prints-deletion/sanitization/${userId}?filename=${userPrints[currentSlideIndex].file_name}`, config);
  
        // Check if deletion was successful
        if (secondResponse.status === 200) {
          setShowLoader(false);
          // Show success message using Swal
          Swal.fire({
            icon: 'success',
            title: 'Prints deleted successfully!',
            text: 'All prints have been deleted.',
          }).then((_result) => {
            // Show loading indicator for two seconds before reloading the page
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              // Reload the page after two seconds
              window.location.reload();
            }, 1);
          });
        } else {
          setShowLoader(false);
          // If deletion fails, show error message using Swal
          Swal.fire({
            icon: 'error',
            title: 'Deletion failed!',
            text: 'An error occurred while sanitizing prints. Please try again later.',
          });
        }
      } else {
        setShowLoader(false);
        // If deletion fails, show error message using Swal
        Swal.fire({
          icon: 'error',
          title: 'Deletion failed!',
          text: 'An error occurred while deleting prints. Please try again later.',
        });
      }
    } catch (error) {
      setShowLoader(false);
      // Handle any errors
      console.error('Error deleting prints:', error);
      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      // Always set isLoading to false after request completes
      setShowLoader(false);
      setIsDeletingPrints(false);
    }
  }
  
  
  // const deleteErrorPrints = async (errorPrints: any) => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   setIsLoading(true);
  
  //   try {
  //     const config = {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //     },
  //       signal: signal
  //     };
  
  //     const theFirstResponse = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/prints-deletion/definitive/${userId}`, config);
  
  
  //     const theSecondResponse = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/prints-deletion/sanitization/${userId}`, config);
  
  
  
  //     setErrorPrints(errorPrints);
  //     console.log(errorPrints)
  
  //   } catch {
  
  //   }
  // }
  // O restante do componente permanece o mesmo
  
  useEffect(() => {
    // const today = new Date().toISOString().split('T')[0]; // Data de hoje
    // const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0]; // Dez dias atrás
    fetchErrorPrints(userId, token )
  //  deleteErrorPrints(errorPrints)
  }, [userId]);
  
  const loadMorePrints = () => {
    setCurrentPage(prevPage => prevPage + 1); // Avança para a próxima página
  };


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

    
    <div>

{showLoader && 
            <div className="loader-container">
                <Loader />
            </div>
        }
      <MainNavbar/>
      <br /><br /><br /><br /><br /><br />
      <FloatingButtons/>
      <CustomNavigationFloatingButton customRedirect={`/user-prints-page/list/${userId}`} icon={FaListAlt} size="50px"/>
    <h2 className='tmt-pastas-titulo'>  
    
                          <FolderOpenOutline
                            color={'#ffffff'} 
                            title={"folder-icon"}
                            height="25px"
                            width="50px"
                            /> 

                             Pasta de prints do usuário {userId}  </h2>
                            <h1 className='tmt-pastas-subtitulo' ><i>{user.username}</i></h1>
                     
    
    {isLoading || isDeletingPrints ? (
      <Loader />
    ) : (
      <div className="carousel-container">
  

<ImageGallery 
        items={images} 
        lazyLoad={true}
        additionalClass="custom-image-gallery" // Adicionando uma classe adicional para estilização personalizada
        thumbnailPosition="left" // Posicionando as miniaturas à esquerda
        autoPlay={false} // Definindo autoPlay como false para desativar o autoplay
        showPlayButton={false} // Ocultando o botão de autoplay
        showNav={true} // Exibir navegação entre as miniaturas
        showThumbnails={true} // Exibir miniaturas
        onErrorImageURL={onError}
        onSlide={(index: number) => setCurrentSlideIndex(index)}
      // showBullets={true}
      
        />
  <br />
{currentSlideIndex >= 0 && (

        <div className='detalhes-do-print'>
          <h4>Detalhes do Print</h4>

          <label >{`PRINT DE Nº ${userPrints[currentSlideIndex].id}`}</label>
        
          <label>{`Detalhes: ${userPrints[currentSlideIndex].details}`}</label>
          <label>{`Fingerprint: ${userPrints[currentSlideIndex].fingerprint}`}</label>
          <label>{`Criado Em: ${formatDate(userPrints[currentSlideIndex].created_at)}`}</label>
          <label>{`IMG_NAME: ${userPrints[currentSlideIndex].file_name}`}</label>
          <br />
          <button className='the-definitive-delete-button' onClick={() => deletePrintsDefinitive()}>EXCLUIR ESTE PRINT</button>
        </div>
      )}

<br />


        {hasMore && (
            <button
              onClick={loadMorePrints}
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
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
      </button>
      <div className='labels-and-inputs'>
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
      </div>
      <button
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
      
        {/* <button
          className="button"
          onClick={() => {
            if (
              currentPage >= 1 &&
              currentPage <= Math.ceil(userPrints.length / itemsPerPage)
            ) {
              setCurrentPage(currentPage);
            }
          }}
        >
          Ir
        </button> */}
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

export default UserPrintsPage;
