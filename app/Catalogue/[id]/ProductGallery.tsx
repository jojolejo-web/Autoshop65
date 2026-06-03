"use client";

import { useState } from "react";

type ProductGalleryProps = {
  alt: string;
  images: string[];
};

export default function ProductGallery({
  alt,
  images,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] ?? "/placeholder.png");

  return (
    <div className="space-y-4 justify-self-center
">
      <img
        src={activeImage}
        alt={alt}
        className="w-90 rounded-lg object-cover"
      />

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-md border ${
                activeImage === image ? "border-zinc-900" : "border-zinc-200"
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
