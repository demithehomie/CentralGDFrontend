import { useState, useEffect } from 'react';
import MainNavbar from '../../../../components/main-navbar/MainNavbar';
import './index.css'
import { CustomNavigationFloatingButton } from '../../../../components/prints-page-floating-button';
import { RiCarouselView } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getToken } from '../../../../services/UsersService';
import { CiViewList } from "react-icons/ci";
import { FaCheckSquare } from "react-icons/fa";
import { ImCheckboxUnchecked } from "react-icons/im";

const itemsPerPage: number = 1;



interface Print {
  id: number;
  file_name: string;
  created_at: string;
  reason: string;
  details: string;
  public: number;
  fingerprint: string;
}

export default function TheMagicToolPrintsListFormat() {
  const navigate = useNavigate()
    const { userId } = useParams<{ userId: string }>();
    const [selectedImages, setSelectedImages] = useState<number[]>([]); // Defining selectedImages as an array of numbers
    // const [hoveredImage, setHoveredImage] = useState<number | null>(null);
    const [_hasMore, setHasMore] = useState<boolean>(true);
    const [_totalPrints, _blanksetTotalPrints] = useState<number>(0);
    const [_isFullSizeModalOpen, _setIsFullSizeModalOpen] = useState<boolean>(false);
    const [_isLoading, setIsLoading] = useState<boolean>(true); // Adicione o estado isLoading
  
    const [user, setUser] = useState<any>({});
    const [userPrints, setUserPrints] = useState<Print[]>([]);
    const [currentPage, _setCurrentPage] = useState<number>(1);
    //const itemsPerPage: number = 1;
    const [_selectedImage, _setSelectedImage] = useState<string | null>(null);
    const [_inputPage, _setInputPage] = useState<number>(currentPage);
    const [_errorPrints, setErrorPrints] = useState<string>('');
    const [currentSlideIndex, _setCurrentSlideIndex] = useState<number>(0);
    const [_isDeletingPrints, setIsDeletingPrints] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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

    // const handleClickVoltar = () => {
    //   navigate(-1); // Navegar uma página para trás no histórico
    // };

    // const openFullSizeModal = () => {
    //   setIsFullSizeModalOpen(true);
    // };
  
    // const closeFullSizeModal = () => {
    //   setIsFullSizeModalOpen(false);
    // };

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
      filename: `${print.file_name}`,
      id: Number(`${print.id}`),
      details:  `${print.details}`,
      fingerprint: `${print.fingerprint}`
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
 
  
    try {
 
      // Exibir mensagem de confirmação
      const confirmationResult = await Swal.fire({
        icon: 'warning',
        title: 'Tem certeza?',
        text: 'Você deseja excluir definitivamente este print?',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      });
  
      // Verificar se o usuário confirmou a exclusão
      if (confirmationResult.isConfirmed) {
        const controller = new AbortController();
        const signal = controller.signal;
        
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
            // If deletion fails, show error message using Swal
            Swal.fire({
              icon: 'error',
              title: 'Deletion failed!',
              text: 'An error occurred while sanitizing prints. Please try again later.',
            });
          }
        } else {
          // If deletion fails, show error message using Swal
          Swal.fire({
            icon: 'error',
            title: 'Deletion failed!',
            text: 'An error occurred while deleting prints. Please try again later.',
          });
        }
      }
    } catch (error) {
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
  
  // const loadMorePrints = () => {
  //   setCurrentPage(prevPage => prevPage + 1); // Avança para a próxima página
  // };

  
  const toggleImageSelection = (id: any) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imageId => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(card => card.id));
    }
  };


  // Lógica para determinar qual ícone mostrar com base no estado dos prints selecionados
  const selectAllIcon = selectedImages.length === userPrints.length ? <ImCheckboxUnchecked /> : <FaCheckSquare /> ;


// Função para excluir prints selecionados
const deleteSelectedPrints = async () => {
  try {
    // Verificar se há prints selecionados
    if (selectedImages.length === 0) {
      return; // Não há prints selecionados para excluir
    }

    // Extrair os nomes dos arquivos dos prints selecionados
    const filenamesToDelete = selectedImages.map(imageId => userPrints.find(print => print.id === imageId)?.file_name).filter(Boolean);

    // Verificar se existem nomes de arquivos para excluir
    if (filenamesToDelete.length === 0) {
      return; // Não há nomes de arquivos para excluir
    }

    // Exibir mensagem de confirmação
    const confirmationResult = await Swal.fire({
      icon: 'warning',
      title: 'Tem certeza?',
      text: 'Você deseja excluir os prints selecionados?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    });

    // Verificar se o usuário confirmou a exclusão
    if (confirmationResult.isConfirmed) {
      // Realizar a solicitação para excluir os prints selecionados
      const response = await axios.delete(`https://gdcompanion-prod.onrender.com/themagictool/prints-deletion/definitive/multiple/${userId}`, {
        data: {
          filenames: filenamesToDelete
        }
      });

      // Verificar se a exclusão foi bem-sucedida
      if (response.status === 200) {
        // Exibir mensagem de sucesso
        Swal.fire({
          icon: 'success',
          title: 'Prints deletados com sucesso!',
          text: 'Todos os prints selecionados foram excluídos.',
        }).then((_result) => {
          // Atualizar a página após a exclusão
          window.location.reload();
        });
      } else {
        // Exibir mensagem de erro se a exclusão falhar
        Swal.fire({
          icon: 'error',
          title: 'Erro ao excluir prints!',
          text: 'Ocorreu um erro ao tentar excluir os prints. Por favor, tente novamente mais tarde.',
        });
      }
    }
  } catch (error) {
    // Exibir mensagem de erro se ocorrer um erro durante a solicitação
    console.error('Error deleting prints:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Ocorreu um erro ao tentar excluir os prints. Por favor, tente novamente mais tarde.',
    });
  }
};

  return (
    <>
   <MainNavbar />
   <br /><br />

   <div className='the-prints-page-text-header'>
   <CiViewList
      color='#ffffff'
      size={45}
      
   
   />
   <h2 className='tmt-pastas-titulo'>{"     "}Lista de prints do Usuário {userId}</h2>
   </div>

   <h1 className='tmt-pastas-subtitulo' ><i>{user.username}</i></h1>

   <br />

   <CustomNavigationFloatingButton customRedirect={`/user-prints-page/${userId}`} icon={RiCarouselView} size="50px"/>
      <div className="definitive-card-list">
      
      <br />
     
      <br />
      <div className='row-of-buttons-prints-page'>
      
      <button onClick={toggleSelectAll}>{selectAllIcon}</button> 
      
      <div className='row-of-buttons-prints-page-internal'>
      {selectedImages.length > 0 && (
      <button onClick={deleteSelectedPrints}  style={{ backgroundColor: "red" }}>Excluir Selecionados</button>
      )}
        <button onClick={getAllPrintsTheMagicTool}>Voltar a Todos os Prints</button>
        <button onClick={backToDashboard}>Início</button>
      </div>
     
      </div>
    
      <br /><br />
        {images.map(print => (
          
          <div 
            key={print.original} 
            className={`definitive-card  ${selectedImages.includes((print.id)) ? 'selected' : ''}`} 
            onClick={() => toggleImageSelection(print.id)}
            style={{ backgroundColor: selectedImages.includes(print.id) ? '#333' : 'transparent' }}
            >

            <input className='checkbox-print-list' type="checkbox" checked={selectedImages.includes(print.id)} onChange={() => toggleImageSelection(print.id)} style={{width: '50px', height: '50px'}} />
         

            <div 
              className="definitive-image-container"
          
              >
              <img src={print.thumbnail} alt={print.filename} className='definitive-card-image' onClick={togglePopup}/>
              {showPopup && (
              <div className="image-popup" onClick={closePopup}>
                <span className="close-button" onClick={closePopup}>X</span>
                <img src={print.original} alt={print.filename} className="popup-image" />
              </div>
            )}
         
            </div>
         

            <div className="definitive-image-content">
              <h3> PRINT DE Nº {print.id}</h3>
              
              <p><strong>Detalhes: </strong> {print.details}</p>
              <p><strong>Fingerprint: </strong> {print.fingerprint}</p>
              <p>IMG_NAME: {print.filename}</p>
              <div className="definitive-buttons">
                <button 
                  onClick={() => deletePrintsDefinitive()}
                  style={{ backgroundColor: "red" }}
                  >Excluir Print
                </button>
                <button onClick={() => window.open(print.original, '_blank')}>Abrir em uma nova guia</button>
              </div>
              <br />
            <hr />
            </div>

          
          </div>
          
        ))}
      
      </div>
    </>
  );
}
