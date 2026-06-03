"use client";

import { useRef, useState, type DragEvent } from "react";
import { createProduct } from "./action";

export default function ProductCreateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !fileInputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInputRef.current.files = transfer.files;
    setSelectedFileName(file.name);
  }

  return (
    <form
      action={createProduct}
      encType="multipart/form-data"
      className="mb-10 grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 md:grid-cols-2"
    >
      <input
        type="text"
        name="productName"
        placeholder="Nom du produit"
        className="rounded-md border px-3 py-2"
        required
      />
      <input
        type="text"
        name="productDescription"
        placeholder="Description"
        className="rounded-md border px-3 py-2"
      />
      <input
        type="number"
        name="price"
        placeholder="Prix en centimes"
        className="rounded-md border px-3 py-2"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="rounded-md border px-3 py-2"
        required
      />

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`md:col-span-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center ${
          isDragging ? "border-zinc-900 bg-zinc-100" : "border-zinc-300"
        }`}
      >
        <span className="font-medium">Image de presentation</span>
        <span className="text-sm text-zinc-500">
          Clique ou glisse une image ici
        </span>
        <span className="mt-2 text-sm text-zinc-700">
          {selectedFileName || "Aucun fichier selectionne"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          name="imageFile"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            setSelectedFileName(event.target.files?.[0]?.name ?? "")
          }
        />
      </label>

      <button
        type="submit"
        className="w-fit rounded-md bg-black px-4 py-2 text-white"
      >
        Ajouter le produit
      </button>
    </form>
  );
}
