"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="w-full max-w-xl space-y-4 justify-self-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
          className="object-cover"
        />
      </div>

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
              <div className="relative h-20 w-20">
                <Image
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
