import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';

import './UserPrintsPage.css';
import Loader from '../../components/loader/Loader';
import FloatingButtons from '../../components/floating-button/FloatingButton';
import MainNavbar from '../../components/main-navbar/MainNavbar';

Modal.setAppElement('#root');

interface UserPrintsPageProps {
  // Define any necessary props here
}

interface Print {
  id: number;
  file_name: string;
  created_at: string;
}

const UserPrintsPage: React.FC<UserPrintsPageProps> = () => {
  const navigate = useNavigate();
 

    const [totalPrints, setTotalPrints] = useState<number>(0);
    const [isFullSizeModalOpen, setIsFullSizeModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Adicione o estado isLoading
    const { userId } = useParams<{ userId: string }>();
    const [userPrints, setUserPrints] = useState<Print[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 4;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [inputPage, setInputPage] = useState<number>(currentPage);
    const openFullSizeModal = () => {
      setIsFullSizeModalOpen(true);
    };
  
    const closeFullSizeModal = () => {
      setIsFullSizeModalOpen(false);
    };

    const handleInputPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPage = parseInt(event.target.value);
      setInputPage(newPage);
    };
  
  
  useEffect(() => {
    const fetchUserPrints = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://gdcompanion-prod.onrender.com/get-all-prints-by-one-id-with-pagination/${userId}?page=${currentPage}&limit=${itemsPerPage}`);
        setTotalPrints(response.data.total);
        setUserPrints(response.data.prints);
      } catch (error) {
        console.error('Error fetching user prints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPrints();
  }, [userId, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalPrints / itemsPerPage);

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
    navigate('/get-prints-themagictool');
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
    <h2 style={{ color: '#ffffff' }}>Prints do usuário {userId} </h2>
    
    {isLoading ? (
      <Loader />
    ) : (
      <div className="carousel-container">
       <Carousel
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
        setSelectedImage(`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`);
        openFullSizeModal();
      }}
    >
      <h3>Criado em {formatDate(print.created_at)}</h3>
      <img
        src={`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${print.file_name}`}
        alt={print.file_name}
        className="carousel-image"
        title={print.created_at}
      />

     
    </div>
  )) : [<p key="no-prints">No prints available.</p>]}
</Carousel>

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
      <button
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
      </button>
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
      <button className="button" onClick={getAllPrintsTheMagicTool}>Voltar para Todos os Prints</button>
      <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
      </div>
    </div>
    </div>
  );
};

export default UserPrintsPage;
