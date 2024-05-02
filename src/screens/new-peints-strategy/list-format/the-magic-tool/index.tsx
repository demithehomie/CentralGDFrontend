import { useState } from 'react';
import MainNavbar from '../../../../components/main-navbar/MainNavbar';
import './index.css'

export default function TheMagicToolPrintsListFormat() {
    const [selectedImages, setSelectedImages] = useState<number[]>([]); // Defining selectedImages as an array of numbers
  // Dummy data for the image cards
  const imageCards = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Card 1',
      details: 'Details of Card 1',
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Card 2',
      details: 'Details of Card 2',
    },
    {
      id: 3,
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Card 3',
      details: 'Details of Card 3',
    },
  ];

  const toggleImageSelection = (id: any) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imageId => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === imageCards.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(imageCards.map(card => card.id));
    }
  };


  return (
    <>
   <MainNavbar />
      <div className="definitive-card-list">
      <br />
      <h3>Visualização em Lista</h3>
      <br />
      <button onClick={toggleSelectAll}>Marcar/Desmarcar Todos</button>
      <br /><br />
        {imageCards.map(card => (
          <div key={card.id} className={`definitive-card ${selectedImages.includes(card.id) ? 'selected' : ''}`} onClick={() => toggleImageSelection(card.id)}>
            <input type="checkbox" checked={selectedImages.includes(card.id)} onChange={() => toggleImageSelection(card.id)} style={{width: '20px', height: '20px'}} />
            <div className="definitive-image-container">
              <img src={card.imageUrl} alt={card.name} className='definitive-card-image'/>
            </div>
            <div className="definitive-image-content">
              <h3>{card.name}</h3>
              <p>{card.details}</p>
              <div className="definitive-buttons">
                <button>Exclude</button>
                <button onClick={() => window.open(card.imageUrl, '_blank')}>Open in new tab</button>
              </div>
            </div>
          </div>
        ))}
      
      </div>
    </>
  );
}
