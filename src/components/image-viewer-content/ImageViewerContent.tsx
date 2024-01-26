import React, { useEffect, useState } from 'react';
import './ImageViewer.css';
import axios from 'axios'
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
//import MiniTargetTable from '../mni-target-table/MiniTargetTable';

export interface Image {
    id: number;
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

const StyledImage = styled.img`
    width: 100px; // ou qualquer outro tamanho que você deseje
    height: auto; // mantém a proporção da imagem
    border-radius: 5px; // se você quiser bordas arredondadas
    // Adicione qualquer outro estilo que você desejar
`;


const TableRow = styled.tr<TableRowProps>`
    background-color: ${props => props.index % 2 === 0 ? 'white' : 'gray'};
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #000000;
`;

const TableCell = styled.td`
    padding: 8px 38px;
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
    const [userNames, setUserNames] = useState<{ [key: number]: string }>({});

    const apiurldev = `https://gdcompanion-prod.onrender.com`;



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
      <Table>
          <thead className='border'>
              <tr>
                  <th className='table-titles'>FileName</th>
                  {/* <th className='table-titles'>ID Registro</th> */}
                  <th className='table-titles'>User ID</th>
                  {/* <th className='table-titles'>Reason</th> */}
                  <th className='table-titles'>Username</th>
              </tr>
          </thead>
          <tbody>

              {processedImages.map((image) => (
                  <TableRow key={image.uid} index={image.index}>
                      {/* <TableCell><ProfileImage src={image.profilePicture} alt="Profile" /></TableCell> */}
                      <TableCell>
                            <StyledImage src={`https://ewr1.vultrobjects.com/screen/THEMAGICT_2102255/${image.file_name}`} alt={image.file_name} onClick={() => zoomImage(image)}/>
                        </TableCell>
                      {/* <TableCell>{image.id}</TableCell> */}
                      <TableCell>{image.user_id}</TableCell>
                        {/* <TableCell>{image.reason}</TableCell> */}
                        {/* <TableCell>{image.details}</TableCell> */}
                        <TableCell>{userNames[image.user_id] || 'Carregando...'}</TableCell>
                        {/* <TableCell>{image.fingerprint}</TableCell> */}
                  </TableRow>
              ))}
          </tbody>
      </Table>
    <br />
      <br />
  
      </>
  );
};
export default ImageViewer;

