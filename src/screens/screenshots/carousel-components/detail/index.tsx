

import * as React from 'react';



//import "slick-carousel/slick/slick.css";
import "./index.css";
import { GalleriesModel } from "../../carousel-models/gallery";
import GalleryDesktop from "../desktop";
import GalleryMobile from "../mobile";

interface Props {
  galleries: GalleriesModel[];
  thumbsPerView: number;
}

const GalleryDetail: React.FC<Props> = ({ galleries, thumbsPerView }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    console.log(galleries);
    setIsMobile(window.innerWidth <= 500);
    window.onresize = () => {
      console.log(window.innerWidth);
      setIsMobile(window.innerWidth <= 500);
    };
  }, [galleries]);

  return (
    <div className="pdp-slider">
      {isMobile ? (
        <GalleryMobile galleries={galleries} />
      ) : (
        <GalleryDesktop galleries={galleries} thumbsPerView={thumbsPerView} />
      )}
    </div>
  );
};

export default GalleryDetail;
