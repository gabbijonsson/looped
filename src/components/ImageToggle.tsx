
import { useState } from "react";

interface ImageToggleProps {
  primaryImageUrl: string;
  thumbnailImageUrl: string;
}

const ImageToggle = ({ primaryImageUrl, thumbnailImageUrl }: ImageToggleProps) => {
  const [primaryImage, setPrimaryImage] = useState(primaryImageUrl);
  const [thumbnailImage, setThumbnailImage] = useState(thumbnailImageUrl);

  const swapImages = () => {
    setPrimaryImage(thumbnailImage);
    setThumbnailImage(primaryImage);
  };

  return (
    <div className="space-y-4">
      <div className="image-slot">
        <img 
          src={primaryImage} 
          alt="Cabin primary view" 
          className="primary-image animate-fade-in"
        />
      </div>
      
      <div className="image-slot" onClick={swapImages}>
        <img 
          src={thumbnailImage} 
          alt="Cabin secondary view" 
          className="thumbnail-image"
        />
        <div className="mt-1 text-center">
          <span className="text-xs text-amber-600">Click to switch images</span>
        </div>
      </div>
    </div>
  );
};

export default ImageToggle;
