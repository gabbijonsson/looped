import { useState, useEffect } from "react";

// Dynamically import all images from the cabin-images directory
const imageModules = import.meta.glob(
  "/src/static/cabin-images/*.{jpeg,jpg,png,gif,svg}"
);

// No longer needs props
const ImageToggle = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImageUrls = async () => {
      try {
        console.log("Available image modules:", Object.keys(imageModules));

        if (Object.keys(imageModules).length === 0) {
          throw new Error("No image modules found");
        }

        const urls = await Promise.all(
          Object.values(imageModules).map(async (importModule) => {
            try {
              const module = await importModule();
              console.log("Loaded module:", module);
              return (module as { default: string }).default;
            } catch (err) {
              console.error("Error loading individual image module:", err);
              throw err;
            }
          })
        );

        console.log("Loaded image URLs:", urls);
        setImageUrls(urls);
        if (urls.length > 0) {
          setCurrentPrimaryImage(urls[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading images:", err);
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImageUrls();
  }, []);

  const setPrimary = (imageUrl: string) => {
    setCurrentPrimaryImage(imageUrl);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-pulse">Loading images...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <div>Error loading images: {error}</div>
        <div className="text-sm mt-2">Check console for details</div>
      </div>
    );
  }

  // If there are no images, display a message
  if (imageUrls.length === 0) {
    return (
      <div className="text-center p-4">
        No images found in cabin-images directory
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
          onError={(e) => {
            console.error("Failed to load image:", currentPrimaryImage);
            console.error("Image error event:", e);
          }}
          onLoad={() => {
            console.log("Successfully loaded image:", currentPrimaryImage);
          }}
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
              onError={(e) => {
                console.error("Failed to load thumbnail:", url);
                console.error("Thumbnail error event:", e);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageToggle;
