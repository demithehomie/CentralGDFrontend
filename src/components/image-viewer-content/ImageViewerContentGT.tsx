import { useEffect, useState } from 'react';
import './ImageViewer.css';
import axios from 'axios'
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import './ImageViewer.css'
//import MiniTargetTable from '../mni-target-table/MiniTargetTable';

export interface Image {
    id: number;
    created_at: string;
    user_id: number;
    file_name: string;
    reason: string;
    details: string;
    public: number;
    fingerprint: number;
    
   
}

interface TableRowProps {
    index: number;
}

const StyledImageContainer = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 10px;
`;

// const TableContainer = styled.div`
//   overflow-x: auto;
// `;


const TableRow = styled.tr<TableRowProps>`
    background-color: ${props => props.index % 2 === 0 ? '#2986cc' : '#9fc5e8'};
    border-radius: 15px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #000000;
  
`;

const TableCell = styled.td`
    padding: 10px 38px;
    border-radius: 5px;
    border: 1px solid #ddd;
    color: #000000;
`;


// const ProfileImage = styled.img`
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
// `;



export type ImageViewerProps = {
    images: Image[];
    onToggleResellerStatus: (userId: number) => Promise<void>;
};

const ImageViewerGT: React.FC<ImageViewerProps> = ({ images }) => {
    const [isZoomed, setIsZoomed] = useState<number | null>(null);
    const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null); // Novo estado para controlar a imagem selecionada

    const showPopup = (image: Image) => {
      setSelectedImage(image); // Define a imagem selecionada
      setPopupVisible(true); // Abre o popup
  };

  const closePopup = () => {
      setSelectedImage(null); // Limpa a imagem selecionada
      setPopupVisible(false); // Fecha o popup
  };
  
    // Função para copiar o texto
 

    const apiurldev = `https://gdcompanion-prod.onrender.com`;

    const handleMouseEnter = (image: any) => {
        setIsZoomed(image);
    };
    
    const handleMouseLeave = () => {
        setIsZoomed(null);
    };
    

    const getUserByID = async (user_id: number) => {
        if (!userNames[user_id]) { // Verifica se já buscamos este nome de usuário
            try {
                const res = await axios.get(`${apiurldev}/users-guerratool/${user_id}`);
                setUserNames(prev => ({ ...prev, [user_id]: res.data.username })); // Supondo que a resposta tem uma propriedade 'username'
            } catch (error) {
                console.error('Erro ao recuperar usuário:', error);
            }
        }
    };

    useEffect(() => {
        images.forEach(image => getUserByID(image.user_id));
    }, [images]);

    const zoomImage = (image: Image) => {
    
            window.open(`https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${image.file_name}`, '_blank');
      
    }

    // const getAllScreenshotRequests = async () => {

    //         try {
    //             const res = await axios.get(`${apiurldev}/get-all-screenshot-requests`);
    //             console.log(res.data);
    //         } catch (error) {
    //             console.error('Erro ao recuperar usuário:', error);
    //         }
       
    // };

      // Inverta a ordem das imagens aqui

      const processedImages = [...images].reverse().map((image, index) => ({
        ...image, 
        uid: uuidv4(), 
        index
       // index: images.length - 1 - index
    }));

// Exemplo: Copiando os detalhes do primeiro item do array 'images'
const copyText = async () => {
  if (!selectedImage) return; // Verifica se há uma imagem selecionada

  try {
    await navigator.clipboard.writeText(selectedImage.details);
    alert('Detalhes copiados com sucesso!');
  } catch (error) {
    console.error('Falha ao copiar os detalhes:', error);
    alert('Falha ao copiar os detalhes.');
  }
};


    return (
        <>
         {/* <TableContainer> */}
          <Table>
            <thead className='border'>
              <tr>
                <th className='table-titles'>FileName</th>
                <th className='table-titles'>User ID</th>
                <th className='table-titles'>Username</th>
                <th className='table-titles'>Criado em</th>
                <th className='table-titles'>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {processedImages.map((image, index) => (
                <TableRow key={image.uid} index={index}>
                <TableCell key={image.uid}>
                <StyledImageContainer
                  onMouseEnter={() => handleMouseEnter(image.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <StyledImage
                    src={`https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${image.file_name}`}
                    alt={image.file_name}
                    onClick={() => zoomImage(image)}
                  />
                  <ZoomedImage
                    src={`https://ewr1.vultrobjects.com/screen/GUERRATOOL_1911554/${image.file_name}`}
                    alt={image.file_name}
                    isZoomed={isZoomed === image.id}
                  />
                </StyledImageContainer>
              </TableCell>
                  <TableCell>
                    <Link className='link' to={`/guerratool/user-prints-page/${image.user_id}`}>{image.user_id}</Link> 
                  </TableCell>
                  <TableCell >
                  <Link className='link' to={`/guerratool/user-prints-page/${image.user_id}`}> 
                    {userNames[image.user_id] || 'Carregando...'}
                  </Link> 
                   
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Converte image.created_at para um objeto Date
                      let date = new Date(image.created_at);

                      // Adiciona três horas (3 horas * 60 minutos * 60 segundos * 1000 milissegundos)
                      date.setTime(date.getTime() + 3 * 60 * 60 * 1000);

                      // Retorna a data formatada em string
                      return date.toLocaleString('pt-BR', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        // Considerando que você pode querer ajustar para o horário de verão ou fuso específico
                        // Isso depende do ambiente de execução, e pode ser necessário ajustar 'hour12' e 'timeZone'
                        hour12: false // Usar formato de 24 horas, opcional
                        // timeZone: 'America/New_York' // Especificar fuso horário, se necessário
                      });
                    })()}
            </TableCell>
            <TableCell onClick={() => showPopup(image)} style={{ cursor: 'pointer' }}>
                    Clique para <br /> mais detalhes.
              </TableCell>

              {isPopupVisible && selectedImage && (
  <>
    <div onClick={closePopup} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 500
    }}></div>
    <div style={{
      borderRadius: '15px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        overflow: 'auto',
        maxHeight: '80vh',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
    }}>
      <h2 style={{ color: "#000000"}}>Detalhes</h2>
      <p style={{ color: "#000000"}}>{selectedImage.details}</p>
      <button onClick={copyText}>Copiar</button>
      <button onClick={closePopup}>Fechar</button>
    </div>
  </>
)}

                </TableRow>
              ))}
            </tbody>
          </Table>
          {/* </TableContainer> */}
          <br />
          <br />
        </>
      );
};
export default ImageViewerGT;

const ZoomedImage = styled.img<{ isZoomed: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 780%; /* Ajuste o tamanho máximo da imagem ampliada conforme necessário */
  max-height: 780%; /* Ajuste o tamanho máximo da imagem ampliada conforme necessário */
  display: ${(props) => (props.isZoomed ? 'block' : 'none')};
  z-index: 999;
`;
