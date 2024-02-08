import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './PrintsTheMagicTool.css';

import ImageViewer, { Image } from '../../../components/image-viewer-content/ImageViewerContent';
import SearchBarPrintsTheMagicTool from '../../../components/search-components/SearchBarPrintsTheMagicTool';
import MainNavbar from '../../../components/main-navbar/MainNavbar';


export default function PrintsTheMagicTool() {
    const navigate = useNavigate();
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [itemsPerPage] = useState<number>(4);
    const apiurldev = `https://gdcompanion-prod.onrender.com`;

    const fetchAndUpdateImages = async () => {
      try {
          setIsLoading(true);
          const response = await fetch(`${apiurldev}/prints-with-pagination?page=${currentPage}&limit=${itemsPerPage}`);
          if (!response.ok) {
              throw new Error('Erro na requisição: ' + response.statusText);
          }
          const data = await response.json();
          
          // Aqui você ajusta para usar os dados recebidos
          const reversedData = data.posts.reverse(); // Agora, os posts estão em data.posts
          setImages(reversedData);
  
          // Calcule o número total de páginas com base no totalPosts recebido
          const totalPages = Math.ceil(data.totalPosts / itemsPerPage);
          setTotalPages(totalPages); // Supondo que você tem um estado para armazenar o total de páginas
  
      } catch (err) {
          // ... manipulação de erros
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

      const Pagination = () => {
        return (
            <div>
                {/* Botão para a primeira página */}
                <button className='pagination-button'  onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    Primeira
                </button>
    
                {/* Botão para duas páginas antes da atual */}
                {currentPage > 2 && (
                    <button className='pagination-button'  onClick={() => handlePageChange(currentPage - 2)}>
                        {currentPage - 2}
                    </button>
                )}
    
                {/* Botão para a página anterior */}
                {currentPage > 1 && (
                    <button className='pagination-button'  onClick={() => handlePageChange(currentPage - 1)}>
                        {currentPage - 1}
                    </button>
                )}
    
                {/* Input numérico para a página atual */}
                <input 
                    type="number" 
                    value={currentPage} 
                    onChange={(e) => handlePageChange(Number(e.target.value))} 
                    min={1} 
                    max={totalPages} 
                    style={{ width: '48px', textAlign: 'center', fontSize: '1rem', borderRadius: '8px', padding: '4px',marginLeft: '3px', marginRight: '2px', border: '3px solid #ffffff'}} 
                />
    
                {/* Botão para a próxima página textAlign: 'center',marginLeft: '2px', marginRight: '2px', border: '2px solid #ffffff' */}
                {currentPage < totalPages && (
                    <button className='pagination-button'  onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 1}
                    </button>
                )}
    
                {/* Botão para duas páginas após a atual */}
                {currentPage < totalPages - 1 && (
                    <button className='pagination-button'  onClick={() => handlePageChange(currentPage + 2)}>
                        {currentPage + 2}
                    </button>
                )}
    
                {/* Botão para a última página */}
                <button className='pagination-button'  onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    Última
                </button>
            </div>
        );
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
              <span className='pagination-page'>Página {currentPage}</span>
              <button className='title-table-black' onClick={() => handlePageChange(currentPage + 1)}>Próxima</button>
             
            </div>
            <br />
            <Pagination/>
          </>
        );
      };
    
      return (
        <div>
           <MainNavbar/>
      <br /><br /><br /><br /><br /><br />
          <h2 className='title-table'>Todos os Reports em The Magic Tool</h2>
          <div>
            <SearchBarPrintsTheMagicTool/>
          </div>
          <br />
          {renderContent()}
          <br />
          <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
        </div>
      );
}
