import * as React from "react";

interface Props {
  path: string;
  onHover?: Function;
  active?: boolean;
}

export const Thumbnail: React.FC<Props> = ({ path, onHover, active }) => {
  return (
    <div
      onMouseEnter={() => onHover && onHover()}
      className={`pdp-slider__thumb ${
        active ? "pdp-slider__thumb--active" : ""
      }`}
    >
      <img src={path} alt="" />
    </div>
  );
};

export default Thumbnail;
