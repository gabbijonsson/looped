
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
    <div className="space-y-3">
      {/* Main image - large display */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <img 
          src={primaryImage} 
          alt="Cabin primary view" 
          className="w-full aspect-[16/9] object-cover animate-fade-in"
        />
      </div>
      
      {/* Thumbnail row */}
      <div className="flex space-x-2">
        <div 
          className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all"
          onClick={swapImages}
        >
          <img 
            src={thumbnailImage} 
            alt="Cabin secondary view" 
            className="w-32 h-24 object-cover"
          />
        </div>
        
        {/* Placeholder for additional thumbnails */}
        <div className="rounded-lg overflow-hidden shadow-md bg-amber-50 w-32 h-24 flex items-center justify-center">
          <span className="text-xs text-amber-700">More coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default ImageToggle;
