export interface GalleryModel {
    url: string;
    alt: string;
    format: "product" | "thumbnail" | "zoom";
  }
  
  export interface GalleriesModel {
    product: GalleryModel;
    thumbnail: GalleryModel;
    zoom: GalleryModel;
  }
  