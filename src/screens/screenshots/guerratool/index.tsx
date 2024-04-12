
import { createRoot } from 'react-dom/client'; 
import { GalleriesModel } from "../carousel-models/gallery";
import GalleryDetail from "../carousel-components/detail";



export const gtDataItems = () => {
  const idsPhotoAmazon = [
    "A1QTZDMGkqL",
    "71YRyWb0rCL",
    "81hWbfwDvkL",
    "81L9SKDriUL",
    "81m8Q6CL73L",
    "71-RnxAnScL"
  ];
  const sizes: any = { thumbnail: 150, product: 550, zoom: 850 };

  return idsPhotoAmazon.map((id, i) => {
    const o: any = {};
    for (let size in sizes) {
      o[size] = {
        url: `https://images-na.ssl-images-amazon.com/images/I/${id}._SX${
          sizes[size]
        }_.jpg`,
        alt: `foto ${i + 1} - ${sizes[size]}px`,
        format: size
      };
    }
    return o;
  }) as GalleriesModel[];
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement); // Create root using createRoot
  root.render(<GalleryDetail galleries={gtDataItems()} thumbsPerView={3} />);
} else {
  console.error('Root element not found!');
}
