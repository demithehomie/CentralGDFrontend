import * as React from "react";
import * as ReactDOM from "react-dom";
//import PinchZoomPan from "react-responsive-pinch-zoom-pan";
import "./index.css";
import { TransformWrapper, TransformComponent  } from "react-zoom-pan-pinch";

interface Props {
  closeModal?: Function;
  image: string;
}
const ModalPreview: React.FC<Props> = ({ closeModal, image }) => {
  React.useEffect(() => {
    console.log("react component mount modal");
  }, []);

  return ReactDOM.createPortal(
    <div className="pdp-modal-preview">
      <button
        className="pdp-modal-preview__close"
        onClick={() => closeModal && closeModal()}
      >
        Cerrar
      </button>
      <div className="pdp-modal-preview__content">
      <TransformWrapper>
      <TransformComponent>
          <img src={image} style={{ width: 400 }} alt="" />
          </TransformComponent>
    </TransformWrapper>
      </div>
    </div>,
    document.body
  );
};

export default ModalPreview;
