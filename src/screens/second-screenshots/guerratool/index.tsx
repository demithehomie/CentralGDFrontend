import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'; // Importando o estilo padrão do react-image-gallery
import MainNavbar from '../../../components/main-navbar/MainNavbar';

const images = [
  {
    original: 'https://source.unsplash.com/random',
    thumbnail: 'https://source.unsplash.com/random',
    description: 'Descrição da imagem 1'
  },
  {
    original: 'https://source.unsplash.com/random2',
    thumbnail: 'https://source.unsplash.com/random',
    description: 'Descrição da imagem 2'
  },
  {
    original: 'https://source.unsplash.com/random',
    thumbnail: 'https://source.unsplash.com/random',
    description: 'Descrição da imagem 3'
  },
  // Adicione mais imagens conforme necessário
];

const GTPRINTS: React.FC = () => {
  return (
    <>
  
    <MainNavbar/>
    <div>
      <ImageGallery
        items={images}
        additionalClass="custom-image-gallery" // Adicionando uma classe adicional para estilização personalizada
        thumbnailPosition="left" // Posicionando as miniaturas à esquerda
        autoPlay={false} // Definindo autoPlay como false para desativar o autoplay
        showPlayButton={false} // Ocultando o botão de autoplay
      />
    </div>
    </>
  );
};

export default GTPRINTS;
