"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { requireAdminSession } from "@/lib/admin";
import {
  isCatalogueCategory,
  type CatalogueCategory,
} from "./categories";

async function saveImageToPublicData(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/\s+/g, "-");
  const filename = `${randomUUID()}-${safeName}`;
  const outputDir = path.join(process.cwd(), "public", "data");
  const outputPath = path.join(outputDir, filename);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, buffer);

  return `data/${filename}`;
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function buildProductWhere(search: string, category?: string) {
  const normalizedSearch = normalizeText(search);
  const hasCategory = category && isCatalogueCategory(category);

  return {
    ...(hasCategory ? { category: category as CatalogueCategory } : {}),
    ...(search
      ? {
          OR: [
            {
              normalizedName: {
                contains: normalizedSearch,
              },
            },
            {
              normalizedDescription: {
                contains: normalizedSearch,
              },
            },
          ],
        }
      : {}),
  };
}

export async function findProduct(
  page: number,
  limit: number,
  search: string,
  category?: string,
) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 8;
  const skip = (safePage - 1) * safeLimit;

  const Products = await prisma.product.findMany({
    where: buildProductWhere(search, category),
    skip,
    take: safeLimit,
  });

  return Products;
}

export async function countProducts(search: string, category?: string) {
  return prisma.product.count({
    where: buildProductWhere(search, category),
  });
}

export async function findProductId(data: { id: number }) {
  const id = data.id;
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const ProductsId = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return ProductsId;
}

export async function createProduct(formData: FormData) {
  await requireAdminSession();

  const productName = String(formData.get("productName") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();
  const productDescription = String(
    formData.get("productDescription") ?? "",
  ).trim();
  const categoryValue = String(formData.get("category") ?? "");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageFile = formData.get("imageFile");
  const galleryFiles = formData.getAll("galleryFiles");

  if (
    !productName ||
    !isCatalogueCategory(categoryValue) ||
    !Number.isInteger(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return;
  }

  const image =
    imageFile instanceof File ? await saveImageToPublicData(imageFile) : null;

  const savedGalleryImages = await Promise.all(
    galleryFiles
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 5)
      .map((file) => saveImageToPublicData(file)),
  );

  const validGallerySources = savedGalleryImages.filter(
    (src): src is string => Boolean(src),
  );

  const product = await prisma.product.create({
    data: {
      productName,
      reference: reference || null,
      productDescription: productDescription || null,
      category: categoryValue,
      image: image || null,
      price,
      stock,

      normalizedName: normalizeText(productName),
      normalizedDescription: normalizeText(productDescription),
    },
  });

  if (validGallerySources.length > 0) {
    await prisma.productImage.createMany({
      data: validGallerySources.map((src, index) => ({
        src,
        sortOrder: index,
        productId: product.id,
      })),
    });
  }

  revalidatePath("/Catalogue");
  revalidatePath(`/Catalogue/${product.id}`);
}

export async function addProductImage(productId: number, formData: FormData) {
  await requireAdminSession();
  const sortOrderValue = Number(formData.get("sortOrder"));
  const imageFiles = formData.getAll("imageFile");

  if (!productId || imageFiles.length === 0) {
    return;
  }

  const savedImages = await Promise.all(
    imageFiles
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 5)
      .map((file) => saveImageToPublicData(file)),
  );

  const validSources = savedImages.filter((src): src is string => Boolean(src));

  if (validSources.length === 0) {
    return;
  }

  await prisma.productImage.createMany({
    data: validSources.map((src, index) => ({
      src,
      sortOrder: Number.isNaN(sortOrderValue) ? index : sortOrderValue + index,
      productId,
    })),
  });

  revalidatePath(`/Catalogue/${productId}`);
}

export async function addToCart(productId: number) {
  type AddToCartResult =
    | { success: false; message: string }
    | {
        success: true;
        cartItem: {
          id: number;
          productId: number;
          cartId: number;
          quantity: number;
        };
        productId: number;
      };

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return { success: false, message: "Utilisateur introuvable" } satisfies AddToCartResult;
  }
  if (!productId) {
    return { success: false, message: "Produit invalide" } satisfies AddToCartResult;
  }

  const result: AddToCartResult = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });

    if (!product) {
      return { success: false, message: "Produit introuvable" };
    }

    if (product.stock <= 0) {
      return { success: false, message: "Produit en rupture de stock" };
    }

    const cart = await tx.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
      select: { quantity: true },
    });

    if (existingItem && existingItem.quantity >= product.stock) {
      return {
        success: false,
        message: "Quantite maximale atteinte pour ce produit",
      };
    }

    const cartItem = await tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
      },
    });

    return { success: true, cartItem, productId: product.id };
  });
  if (result.success) {
    revalidatePath("/Catalogue");
    revalidatePath(`/Catalogue/${result.productId}`);
    revalidatePath("/Cart");
  }
  return result;
}
