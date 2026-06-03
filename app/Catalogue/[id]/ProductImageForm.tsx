"use client";

import { useRef, useState, type DragEvent } from "react";

type ProductImageFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export default function ProductImageForm({ action }: ProductImageFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []).slice(0, 5);
    if (files.length === 0 || !fileInputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    fileInputRef.current.files = transfer.files;
    setSelectedFileNames(files.map((file) => file.name));
  }

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="mb-10 flex flex-wrap items-end gap-4 rounded-lg border border-zinc-200 bg-white p-6"
    >
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-32 min-w-80 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center ${
          isDragging ? "border-zinc-900 bg-zinc-100" : "border-zinc-300"
        }`}
      >
        <span className="font-medium">Images de galerie</span>
        <span className="text-sm text-zinc-500">
          Clique ou glisse jusqu&apos;a 5 images ici
        </span>
        <div className="mt-2 text-sm text-zinc-700">
          {selectedFileNames.length > 0
            ? selectedFileNames.map((fileName) => (
                <div key={fileName}>{fileName}</div>
              ))
            : "Aucun fichier selectionne"}
        </div>
        <input
          ref={fileInputRef}
          id="imageFile"
          type="file"
          name="imageFile"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) =>
            setSelectedFileNames(
              Array.from(event.target.files ?? [])
                .slice(0, 5)
                .map((file) => file.name)
            )
          }
        />
      </label>

      <div className="flex flex-col gap-2">
        <label htmlFor="sortOrder" className="text-sm font-medium">
          Ordre
        </label>
        <input
          id="sortOrder"
          type="number"
          name="sortOrder"
          placeholder="0"
          className="w-24 rounded-md border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Ajouter les images
      </button>
    </form>
  );
}
