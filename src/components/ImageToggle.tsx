import { useState, useEffect } from "react";

// Dynamically import all images from the cabin-images directory
const imageModules = import.meta.glob(
  "/src/static/cabin-images/*.{jpeg,jpg,png,gif,svg}"
);

// No longer needs props
const ImageToggle = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState<string>("");

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = await Promise.all(
        Object.values(imageModules).map(async (importModule) => {
          const module = await importModule();
          return (module as { default: string }).default;
        })
      );
      setImageUrls(urls);
      if (urls.length > 0) {
        setCurrentPrimaryImage(urls[0]);
      }
    };

    loadImageUrls();
  }, []);

  const setPrimary = (imageUrl: string) => {
    setCurrentPrimaryImage(imageUrl);
  };

  // If there are no images, display a message or nothing
  if (imageUrls.length === 0) {
    return (
      <div className="text-center p-4">
        Loading images or no images found...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image - large display */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={currentPrimaryImage}
          alt="Cabin primary view"
          className="w-full aspect-[16/9] object-cover animate-fade-in"
        />
      </div>

      {/* Thumbnail row */}
      <div className="flex flex-wrap gap-2 py-2 justify-center">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-md cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all ${
              currentPrimaryImage === url ? "ring-2 ring-amber-500" : ""
            }`}
            onClick={() => setPrimary(url)}
            style={{ minWidth: "2.75rem" }}
          >
            <img
              src={url}
              alt={`Cabin view ${index + 1}`}
              className="w-full h-8 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageToggle;
