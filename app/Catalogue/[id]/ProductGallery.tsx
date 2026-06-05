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
    <div className="space-y-4 justify-self-center
">
      <div className="relative h-80 w-80 overflow-hidden rounded-lg sm:h-90 sm:w-90">
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 320px, 360px"
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
