import React, { useEffect, useState } from 'react';
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

const ImageViewer: React.FC<ImageViewerProps> = ({ images }) => {
    const [isZoomed, setIsZoomed] = useState<number | null>(null);
    const [userNames, setUserNames] = useState<{ [key: number]: string }>({});

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
                const res = await axios.get(`${apiurldev}/users/${user_id}`);
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
    
            window.open(`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${image.file_name}`, '_blank');
      
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

      const processedImages = [...images].map((image, index) => ({
        ...image, 
        uid: uuidv4(), 
        index: images.length - 1 - index
    }));

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
              </tr>
            </thead>
            <tbody>
              {processedImages.map((image) => (
                <TableRow key={image.uid} index={image.index}>
                <TableCell key={image.uid}>
                <StyledImageContainer
                  onMouseEnter={() => handleMouseEnter(image.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <StyledImage
                    src={`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${image.file_name}`}
                    alt={image.file_name}
                    onClick={() => zoomImage(image)}
                  />
                  <ZoomedImage
                    src={`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${image.file_name}`}
                    alt={image.file_name}
                    isZoomed={isZoomed === image.id}
                  />
                </StyledImageContainer>
              </TableCell>
                  <TableCell>
                    <Link className='link' to={`/user-prints-page/${image.user_id}`}>{image.user_id}</Link> 
                  </TableCell>
                  <TableCell >
                  <Link className='link' to={`/user-prints-page/${image.user_id}`}> 
                    {userNames[image.user_id] || 'Carregando...'}
                  </Link> 
                   
                  </TableCell>
                  <TableCell>
                    {new Date(image.created_at).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </TableCell>

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
export default ImageViewer;

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
