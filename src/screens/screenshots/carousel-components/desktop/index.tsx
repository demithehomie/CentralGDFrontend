import * as React from "react";
import Slider from "react-slick";


//import ZoomPreview from "./../ZoomPreview";
import Thumbnail from "../thumbnail";
import { GalleriesModel } from "../../carousel-models/gallery";

interface Props {
  galleries: GalleriesModel[];
  thumbsPerView: number;
}

const GalleryDesktop: React.FC<Props> = ({ galleries, thumbsPerView }) => {
  const refSlider = React.useRef<any>();
  const [currentItem, setCurrentItem] = React.useState(0);

  const sliderProps = {
    vertical: true,
    accessibility: false,
    slidesToShow: thumbsPerView,
    centerMode: false,
    swipe: false,
    infinite: false
  };

  const onHoverThumbnail = (position: number): void => {
    const $content = refSlider.current as HTMLElement;
    if ($content) {
      Array.from($content.querySelectorAll(".pdp-slider__thumb")).forEach(
        $thumb => {
          $thumb.classList.remove("pdp-slider__thumb--active");
        }
      );
      setCurrentItem(position);
    }
    console.log(position);
  };

  const thumbs = galleries.map((item, k) => (
    <Thumbnail
      key={k}
      active={k === currentItem}
      onHover={() => onHoverThumbnail(k)}
      path={item.thumbnail.url}
    />
  ));
  return (
    <React.Fragment>
      <div className="pdp-slider__thumbs" ref={refSlider}>
        {thumbs.length > thumbsPerView ? (
          <React.Fragment>
            <Slider {...sliderProps}>{thumbs}</Slider>
          </React.Fragment>
        ) : (
          thumbs
        )}
      </div>
      {/* <ZoomPreview
        image={galleries[currentItem].product.url}
        zoom={galleries[currentItem].zoom.url}
      /> */}
    </React.Fragment>
  );
};

export default GalleryDesktop;
