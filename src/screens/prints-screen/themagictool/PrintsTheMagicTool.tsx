import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './PrintsTheMagicTool.css';

import ImageViewer, { Image } from '../../../components/image-viewer-content/ImageViewerContent';


export default function PrintsTheMagicTool() {
    const navigate = useNavigate();
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(4);
    const apiurldev = `https://gdcompanion-prod.onrender.com`;

    const fetchAndUpdateImages = async () => {
      const endpoint = `${apiurldev}/prints-with-pagination?page=${currentPage}&limit=${itemsPerPage}`;
      try {
        setIsLoading(true);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        const data = await response.json();
  
        // Inverter a ordem dos dados aqui
        const reversedData = data.reverse();
  
        setImages(reversedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
  };
  
    
      useEffect(() => {
        fetchAndUpdateImages();
      }, [currentPage, itemsPerPage]);

      const toggleResellerStatus = async (userId: number) => {
        try {
          const response = await fetch(`${apiurldev}/users/${userId}/toggle-reseller`, { method: 'PUT' });
          if (!response.ok) {
            throw new Error('Falha ao atualizar o status de revendedor');
          }
          await fetchAndUpdateImages();
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
        }
      };
    
      const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
      };
    
      const backToDashboard = () => {
        navigate('/dashboard');
      };
    
      const renderContent = () => {
        if (isLoading) {
          return <center><div className="loader"></div><h3 className='loading-messages'>Carregando Prints..</h3></center>;
        }
        if (error) {
          return <p className="error-message">Ocorreu um erro: {error}</p>;
        }
        return (
          <>
            <ImageViewer images={images} onToggleResellerStatus={toggleResellerStatus} />
            <div className="pagination">
              <button className='title-table-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
              <span style={{ color: '#ffffff'}}>Página {currentPage}</span>
              <button className='title-table-black' onClick={() => handlePageChange(currentPage + 1)}>Próxima</button>
            </div>
          </>
        );
      };
    
      return (
        <div>
          <h2 className='title-table'>Todos os Reports em The Magic Tool</h2>
          {/* <div>
            <SearchBar/>
          </div> */}
          <br />
          {renderContent()}
          <br />
          <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
        </div>
      );
}
