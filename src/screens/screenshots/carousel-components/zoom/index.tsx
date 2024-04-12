import * as React from "react";
import "./index.scss";

interface Props {
  image: string;
  zoom: string;
}

const ZoomPreview: React.FC<Props> = ({ image, zoom }) => {
  const onMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    const target = e.currentTarget as HTMLElement;
    const x = (e.nativeEvent.offsetX / target.offsetWidth) * 100;
    const y = (e.nativeEvent.offsetY / target.offsetHeight) * 100;
    target.style.backgroundPosition = x + "% " + y + "%";
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>): void => {
    const target = e.currentTarget;
    const zoom = target.getAttribute("data-zoom");
    const $img = target.querySelector("img");

    if ($img) {
      ($img.nextSibling as HTMLElement).style.display = "block";
    }

    if (zoom) {
      const temp = new Image();
      temp.src = zoom;
      temp.onload = () => {
        target.style.backgroundImage = `url(${zoom})`;
        if ($img) {
          $img.style.opacity = "0";
          ($img.nextSibling as HTMLElement).style.display = "none";
        }
      };
    }
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLElement>): void => {
    const target = e.currentTarget;
    const $img = target.querySelector("img");
    target.removeAttribute("style");
    if ($img) {
      $img.style.opacity = "1";
      ($img.nextSibling as HTMLElement).style.display = "none";
    }
  };

  return (
    <div
      className="pdp-slider__galleries zoom"
      data-zoom={zoom}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img alt="" src={image} />
      <div className="zoom__loading" />
    </div>
  );
};

export default ZoomPreview;
