import * as React from "react";
import Slider from "react-slick";




import "./index.css";
import ModalPreview from "../modal-preview";
import { GalleriesModel } from "../../carousel-models/gallery";

interface Props {
  galleries: GalleriesModel[];
}

const GalleryMobile: React.FC<Props> = ({ galleries }) => {
  const [modal, setModal] = React.useState({ visible: false, data: "" });
  const [showIconPreview, setShowIconPreview] = React.useState(true);
  let isSwipe = false;

  const sliderProps = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const onMouseUp = (gallery: GalleriesModel) => {
    if (!isSwipe) {
      setModal({ visible: !modal.visible, data: gallery.zoom.url });
    }
  };

  const onMouseDown = () => {
    isSwipe = false;
  };

  const onMouseMove = () => {
    isSwipe = true;
  };

  React.useEffect(() => {
    console.log({ modal });
    document.body.style.overflow = modal.visible ? "hidden" : "auto";
  }, [modal]);

  React.useEffect(() => {
    setTimeout(() => setShowIconPreview(false), 2000);
  }, []);

  return (
    <React.Fragment>
      <Slider className="pdp-slider__mobile" {...sliderProps}>
        {galleries.map((gallery, k) => (
          <div className="mobile-gallery" key={k}>
            <img src={gallery.product.url} alt={gallery.product.alt} />
            <div
              className="preview"
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}
              onMouseMove={onMouseMove}
              onTouchMove={onMouseMove}
              onMouseUp={() => onMouseUp(gallery)}
              onTouchEnd={() => onMouseUp(gallery)}
            >
              {showIconPreview && <button>Preview</button>}
            </div>
          </div>
        ))}
      </Slider>
      {modal.visible && (
        <ModalPreview
          image={modal.data}
          closeModal={() => setModal({ visible: !modal.visible, data: "" })}
        />
      )}
    </React.Fragment>
  );
};

export default GalleryMobile;
