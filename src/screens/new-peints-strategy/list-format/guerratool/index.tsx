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

export default function GuerraToolPrintsListFormat() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>();
  const [selectedImages, setSelectedImages] = useState<number[]>([]); // Defining selectedImages as an array of numbers
  // const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [prettyLoader, setThePrettyLoader] = useState(false)
  const [_hasMore, setHasMore] = useState<boolean>(true);
  const [_totalPrints, _blanksetTotalPrints] = useState<number>(0);
  const [_isFullSizeModalOpen, _setIsFullSizeModalOpen] = useState<boolean>(false);
  const [_isLoading, setIsLoading] = useState<boolean>(true); // Adicione o estado isLoading
  const [ page, setPage] = useState(1);
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

  const fetchMorePrints = async (userId: any, itemsPerPage: any, token: any, page: number) => {
    const controller = new AbortController();
    const signal = controller.signal;
   // const page = 1;

    setIsLoading(true);
    try {
      setThePrettyLoader(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: signal
        };

        const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/get-all-prints/with-new-pagination/${userId}?page=${page}`, config);

        // Filter out any errors (404 or otherwise) from$@$v=v1.16$@$the response data
        const filteredPrints = response.data.filter((the_prints: any) => the_prints.status !== 'error');

        setUserPrints((prevPrints) => [...prevPrints, ...filteredPrints]);
        setHasMore(filteredPrints.length >= itemsPerPage);
        console.log(userPrints)
      } catch (error) {
      //  setThePrettyLoader(false);
        if (axios.isCancel(error)) {
          console.log('Solicitação cancelada:', error.message);
        } else {
          console.error('Erro ao buscar mais prints do usuário:', error);
        }
      } finally {
        setThePrettyLoader(false);
        setIsLoading(false);
      }
      };

  useEffect(() => {
    fetchMorePrints(userId,  itemsPerPage, token, page);
  }, [userId, page]);

  
  const images = userPrints.map((the_prints) => ({
    original: `https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${the_prints.file_name}`,
    thumbnail: `https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${the_prints.file_name}`,
    description: `Criado em ${formatDate(the_prints.created_at)}`,
    filename: `${the_prints.file_name}`,
    id: Number(`${the_prints.id}`),
    details:  `${the_prints.details}`,
    fingerprints: `${the_prints.fingerprint}`,
    created_at: `${the_prints.created_at}`
  }));

const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/users/${userId}`, {
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

const getAllPrintsGuerraTool = () => {
  navigate('/guerratool/new-screen/get-all-prints');
};

// Função para remover duplicatas com base em uma chave específica
// Função para remover todas as duplicatas
const removeDuplicates = (array: any[]) => {
  const uniqueArray: any[] = [];
  const keys: string[] = [];

  array.forEach((item: any) => {
    // Gerar uma chave única para o item
    const key = JSON.stringify(item);
    
    // Verificar se a chave já foi encontrada
    if (!keys.includes(key)) {
      // Adicionar o item único ao array e registrar a chave
      uniqueArray.push(item);
      keys.push(key);
    }
  });

  return uniqueArray;
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

    const response = await axios.get(`https://gdcompanion-prod.onrender.com/guerratool/get-all-prints/with-new-pagination/${userId}`, config);

    // Filter out any prints with rendering errors
    const errorPrints = response.data.filter((the_prints: any) => the_prints.status === 'rendering_error');

    // Filter out any prints without rendering errors and remove duplicates
    const uniquePrints = removeDuplicates(response.data.filter((the_prints: any) => the_prints.status !== 'rendering_error'));
     setUserPrints(uniquePrints);
     setHasMore(uniquePrints.length >= itemsPerPage);
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
      const queryStringFirst = `?filename=${userPrints[currentSlideIndex].file_name}&path=/GUERRATOOL_1911554/`;
  
      // First, delete prints definitively with query string
      const firstResponse = await axios.delete(`https://gdcompanion-prod.onrender.com/guerratool/prints-deletion/definitive/${userId}${queryStringFirst}`, config);
  
      // Check if deletion was successful
      if (firstResponse.status === 200) {
        // Then, sanitize any remaining prints
        const secondResponse = await axios.delete(`https://gdcompanion-prod.onrender.com/guerratool/prints-deletion/sanitization/${userId}?filename=${userPrints[currentSlideIndex].file_name}`, config);
  
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
  const filenamesToDelete = selectedImages.map(imageId => userPrints.find(the_prints => the_prints.id === imageId)?.file_name).filter(Boolean);

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
    const response = await axios.delete(`https://gdcompanion-prod.onrender.com/guerratool/prints-deletion/definitive/multiple/${userId}`, {
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

const loadMorePrints = () => {
  setPage(page + 1);
};


const LoadMoreButton = ({ onClick }: any) => (
  <button className="load-more-button" onClick={onClick}>
    Carregar Mais
  </button>
);

return (
  <>
     {prettyLoader && <div className="overlay" />}
    {prettyLoader && <span className="the-pretty-loader" />}
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

 <CustomNavigationFloatingButton customRedirect={`/guerratool/user-prints-page/${userId}`} icon={RiCarouselView} size="50px"/>
    <div className="definitive-card-list">
    
    <br />
   
    <br />
    <div className='row-of-buttons-prints-page'>
    
    <button onClick={toggleSelectAll}>{selectAllIcon}</button> 
    
    <div className='row-of-buttons-prints-page-internal'>
    {selectedImages.length > 0 && (
      <>
     
       <h2>{selectedImages.length} prints selecionados</h2>
    <button onClick={deleteSelectedPrints}  style={{ backgroundColor: "red" }}>Excluir Selecionados</button>
    </>
    )}
   
    <h2>{images.length} prints carregados</h2>

      <button onClick={getAllPrintsGuerraTool}>Voltar a Todos os Prints</button>
      <button onClick={backToDashboard}>Início</button>
    </div>
   
    </div>
  
    <br /><br />
      {images.map(the_prints => (
          <>
        <div 
          key={the_prints.original} 
          className={`definitive-card  ${selectedImages.includes((the_prints.id)) ? 'selected' : ''}`} 
          onClick={() => toggleImageSelection(the_prints.id)}
          style={{ backgroundColor: selectedImages.includes(the_prints.id) ? '#333' : 'transparent' }}
          >

          <input className='checkbox-print-list' type="checkbox" checked={selectedImages.includes(the_prints.id)} onChange={() => toggleImageSelection(the_prints.id)} style={{width: '50px', height: '50px'}} />
       

          <div 
            className="definitive-image-container"
        
            >
            <img src={the_prints.thumbnail} alt={the_prints.filename} className='definitive-card-image' onClick={togglePopup}/>
            {showPopup && (
            <div className="image-popup" onClick={closePopup}>
              <span className="close-button" onClick={closePopup}>X</span>
              <img src={the_prints.original} alt={the_prints.filename} className="popup-image" />
            </div>
          )}
           <LoadMoreButton onClick={loadMorePrints} />
          </div>
       

          <div className="definitive-image-content">
            <h3> PRINT DE Nº {the_prints.id}</h3>
            
            <p><strong>Detalhes: </strong> {the_prints.details}</p>
            <p><strong>Fingerprint: </strong> {the_prints.fingerprints}</p>
            <p>Criado em : {formatDate(the_prints.created_at)}</p>
            <p>IMG_NAME: {the_prints.filename}</p>
            <div className="definitive-buttons">
              <button 
                onClick={() => deletePrintsDefinitive()}
                style={{ backgroundColor: "red" }}
                >Excluir Print
              </button>
              <button onClick={() => window.open(the_prints.original, '_blank')}>Abrir em uma nova guia</button>
            </div>
        
            <br />
          <hr />
          </div>


        
        </div>
      
      
        </>
     
        
      ))}
    
    </div>
  </>
);
}

