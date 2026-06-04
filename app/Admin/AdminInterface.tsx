"use client";

import { useState, useTransition } from "react";
import { BarChart3, Package, PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createProductFromAdmin,
  deleteProductFromAdmin,
  markOrderPrepared,
  updateProductFromAdmin,
} from "./action";
import { catalogueCategories, getCategoryLabel } from "@/app/Catalogue/categories";

type AdminInterfaceProps = {
  stats: {
    usersCount: number;
    ordersCount: number;
    paidOrdersCount: number;
    preparedOrdersCount: number;
  };
  products: AdminProduct[];
  activeOrders: AdminOrder[];
  orderHistory: AdminOrder[];
};

type AdminProduct = {
  id: number;
  productName: string;
  price: number;
  stock: number;
  image: string | null;
  category: (typeof catalogueCategories)[number]["value"];
  usedInOrdersCount: number;
};

type AdminOrder = {
  id: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  isPrepared: boolean;
  totalAmount: number;
  createdAt: string;
  preparedAt: string | null;
  user: {
    email: string;
    name: string | null;
    surName: string | null;
  };
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    productNameSnapshot: string;
    image: string | null;
  }[];
  transaction: {
    id: number;
    status: "pending" | "succeeded" | "failed" | "cancelled";
    provider: string;
  } | null;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function formatDate(date: string | null) {
  if (!date) {
    return "Non preparee";
  }

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getCustomerName(order: AdminOrder) {
  return [order.user.surName, order.user.name].filter(Boolean).join(" ") || order.user.email;
}

function getOrderBadge(status: AdminOrder["status"], isPrepared: boolean) {
  if (isPrepared) {
    return "border-green-200 bg-green-50 text-green-700";
  }

  switch (status) {
    case "paid":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "cancelled":
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

function getOrderBadgeLabel(status: AdminOrder["status"], isPrepared: boolean) {
  if (isPrepared) {
    return "Preparee";
  }

  switch (status) {
    case "paid":
      return "A preparer";
    case "cancelled":
      return "Annulee";
    case "failed":
      return "Echouee";
    default:
      return status;
  }
}

export default function AdminInterface({
  stats,
  products,
  activeOrders,
  orderHistory,
}: AdminInterfaceProps) {
  const [orders, setOrders] = useState(activeOrders);
  const [history, setHistory] = useState(orderHistory);
  const [productList, setProductList] = useState(products);
  const [productSearch, setProductSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [productPage, setProductPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handlePrepared(orderId: number) {
    startTransition(async () => {
      setFeedback(null);
      const result = await markOrderPrepared(orderId);

      if (!result.success) {
        setFeedback(result.message);
        return;
      }

      const order = orders.find((item) => item.id === orderId);

      if (!order) {
        return;
      }

      const preparedOrder = {
        ...order,
        isPrepared: true,
        preparedAt: new Date().toISOString(),
      };

      setOrders((current) => current.filter((item) => item.id !== orderId));
      setHistory((current) => [preparedOrder, ...current]);
      setFeedback(`Commande #${orderId} marquee comme preparee`);
    });
  }

  function handleDeleteProduct(productId: number) {
    startTransition(async () => {
      setFeedback(null);
      const result = await deleteProductFromAdmin(productId);

      if (!result.success) {
        setFeedback(result.message);
        return;
      }

      setProductList((current) =>
        current.filter((product) => product.id !== result.productId),
      );
      setFeedback(`Piece #${productId} supprimee`);
    });
  }

  function handleProductFieldChange(
    productId: number,
    field: "price" | "stock",
    value: number,
  ) {
    setProductList((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, [field]: value } : product,
      ),
    );
  }

  function handleUpdateProduct(productId: number) {
    const product = productList.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    startTransition(async () => {
      setFeedback(null);
      const result = await updateProductFromAdmin({
        productId,
        price: product.price,
        stock: product.stock,
      });

      if (!result.success) {
        setFeedback(result.message);
        return;
      }

      setProductList((current) =>
        current.map((item) =>
          item.id === productId
            ? {
                ...item,
                price: result.product.price,
                stock: result.product.stock,
              }
            : item,
        ),
      );
      setFeedback(`Piece #${productId} mise a jour`);
    });
  }

  const filteredProducts = productList.filter((product) =>
    product.productName.toLowerCase().includes(productSearch.trim().toLowerCase()),
  );
  const productsPerPage = 5;
  const totalProductPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  );
  const safeProductPage = Math.min(productPage, totalProductPages);
  const paginatedProducts = filteredProducts.slice(
    (safeProductPage - 1) * productsPerPage,
    safeProductPage * productsPerPage,
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-red-50 via-white to-zinc-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-red-700">Administration</h1>
          <p className="mt-2 text-zinc-600">
            Gere les commandes, les produits et les indicateurs du site.
          </p>
        </div>

        {feedback ? (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {feedback}
          </div>
        ) : null}

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-1 gap-2 border border-red-100 bg-red-50/80 p-1 md:grid-cols-3 mb-15">
            <TabsTrigger
              value="orders"
              className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Package className="size-4" />
              Commandes
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <PlusCircle className="size-4" />
              Ajouter une piece
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <BarChart3 className="size-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-red-700">Commandes a preparer</h2>
                <p className="text-sm text-zinc-600">
                  Commandes payees, non encore marquees comme preparees.
                </p>
              </div>

              {orders.length === 0 ? (
                <Card className="border-red-100">
                  <CardContent className="p-8 text-center text-zinc-500">
                    Aucune commande a preparer
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="border-red-100 shadow-sm shadow-red-100/40">
                    <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <CardTitle className="text-red-700">Commande #{order.id}</CardTitle>
                        <CardDescription>
                          {getCustomerName(order)} • {order.user.email}
                        </CardDescription>
                        <CardDescription>
                          Passee le {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>

                      <div className="space-y-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getOrderBadge(order.status, order.isPrepared)}`}
                        >
                          {getOrderBadgeLabel(order.status, order.isPrepared)}
                        </span>
                        <p className="text-lg font-semibold text-zinc-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <Button
                          onClick={() => handlePrepared(order.id)}
                          disabled={isPending}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Commande preparee
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50/40 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-white">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productNameSnapshot}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-zinc-400">Image</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900">{item.productNameSnapshot}</p>
                              <p className="text-sm text-zinc-500">Quantite : {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-zinc-700">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-red-700">Historique des commandes</h2>
                <p className="text-sm text-zinc-600">
                  Commandes preparees, annulees ou echouees.
                </p>
              </div>

              {history.length === 0 ? (
                <Card className="border-red-100">
                  <CardContent className="p-8 text-center text-zinc-500">
                    Aucun historique disponible
                  </CardContent>
                </Card>
              ) : (
                history.map((order) => (
                  <Card key={order.id} className="border-red-100 shadow-sm shadow-red-100/40">
                    <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <CardTitle className="text-red-700">Commande #{order.id}</CardTitle>
                        <CardDescription>
                          {getCustomerName(order)} • {order.user.email}
                        </CardDescription>
                      </div>
                      <div className="space-y-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getOrderBadge(order.status, order.isPrepared)}`}
                        >
                          {getOrderBadgeLabel(order.status, order.isPrepared)}
                        </span>
                        <p className="text-sm text-zinc-500">
                          Finalisee le {formatDate(order.preparedAt ?? order.createdAt)}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </section>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardTitle className="text-red-700">Ajouter une piece</CardTitle>
                  <CardDescription>
                    Un seul formulaire : image principale + photos de presentation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={createProductFromAdmin} className="grid gap-5">
                    <div className="grid gap-2">
                      <label
                        htmlFor="admin-product-name"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Nom de la piece
                      </label>
                      <input
                        id="admin-product-name"
                        type="text"
                        name="productName"
                        placeholder="Ex. Feu arriere Clio 2"
                        className="w-full rounded-md border border-red-100 bg-white px-4 py-3"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="admin-product-description"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="admin-product-description"
                        name="productDescription"
                        placeholder="Etat, compatibilite, remarques..."
                        className="min-h-28 w-full rounded-md border border-red-100 bg-white px-4 py-3"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="admin-product-category"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Categorie
                      </label>
                      <select
                        id="admin-product-category"
                        name="category"
                        defaultValue="carroserie"
                        className="w-full rounded-md border border-red-100 bg-white px-4 py-3"
                        required
                      >
                        {catalogueCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <label
                          htmlFor="admin-product-price"
                          className="text-sm font-medium text-zinc-700"
                        >
                          Prix en centimes
                        </label>
                        <input
                          id="admin-product-price"
                          type="number"
                          name="price"
                          placeholder="Ex. 2500"
                          className="w-full rounded-md border border-red-100 bg-white px-4 py-3"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          htmlFor="admin-product-stock"
                          className="text-sm font-medium text-zinc-700"
                        >
                          Stock disponible
                        </label>
                        <input
                          id="admin-product-stock"
                          type="number"
                          name="stock"
                          placeholder="Ex. 1"
                          className="w-full rounded-md border border-red-100 bg-white px-4 py-3"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="admin-product-image"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Image principale
                      </label>
                      <input
                        id="admin-product-image"
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        capture="environment"
                        className="w-full rounded-md border border-red-100 bg-white px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="admin-product-gallery"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Photos de presentation
                      </label>
                      <input
                        id="admin-product-gallery"
                        type="file"
                        name="galleryFiles"
                        accept="image/*"
                        capture="environment"
                        multiple
                        className="w-full rounded-md border border-red-100 bg-white px-4 py-3 text-sm"
                      />
                      <p className="text-sm text-zinc-500">
                        Jusqu&apos;a 5 images de galerie, ajoutees directement a la piece.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-red-600 py-6 text-base hover:bg-red-700"
                    >
                      Ajouter la piece
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardTitle className="text-red-700">Gerer les pieces</CardTitle>
                  <CardDescription>
                    Recherche une piece, modifie son prix ou son stock, ou supprime-la si elle n&apos;est liee a aucune commande.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setProductPage(1);
                      }}
                      placeholder="Rechercher une piece"
                      className="w-full rounded-md border border-red-100 bg-white py-3 pl-10 pr-4"
                    />
                  </div>

                  {filteredProducts.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500">
                      Aucune piece correspondante
                    </p>
                  ) : (
                    paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-lg border border-red-100 bg-red-50/40 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-white">
                            {product.image ? (
                              <img
                                src={`/${product.image}`}
                                alt={product.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-zinc-400">Image</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900">{product.productName}</p>
                            <p className="text-xs text-zinc-500">ID : {product.id}</p>
                            <p className="text-xs text-zinc-500">
                              Categorie : {getCategoryLabel(product.category)}
                            </p>
                            {product.usedInOrdersCount > 0 ? (
                              <p className="text-xs text-red-600">
                                Deja liee a {product.usedInOrdersCount} commande(s)
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 lg:grid-cols-2">
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) =>
                              handleProductFieldChange(
                                product.id,
                                "price",
                                Number(e.target.value),
                              )
                            }
                            className="rounded-md border border-red-100 bg-white px-3 py-2"
                            placeholder="Prix"
                          />
                          <input
                            type="number"
                            value={product.stock}
                            onChange={(e) =>
                              handleProductFieldChange(
                                product.id,
                                "stock",
                                Number(e.target.value),
                              )
                            }
                            className="rounded-md border border-red-100 bg-white px-3 py-2"
                            placeholder="Stock"
                          />
                        </div>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <Button
                            onClick={() => handleUpdateProduct(product.id)}
                            disabled={isPending}
                            className="w-full bg-red-600 hover:bg-red-700 sm:flex-1"
                          >
                            Enregistrer
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isPending || product.usedInOrdersCount > 0}
                            className="w-full sm:flex-1"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))
                  )}

                  {filteredProducts.length > productsPerPage ? (
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setProductPage((current) => Math.max(1, current - 1))
                        }
                        disabled={safeProductPage === 1}
                      >
                        Precedent
                      </Button>
                      <p className="text-sm text-zinc-600">
                        Page {safeProductPage} / {totalProductPages}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setProductPage((current) =>
                            Math.min(totalProductPages, current + 1),
                          )
                        }
                        disabled={safeProductPage === totalProductPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardDescription>Utilisateurs</CardDescription>
                  <CardTitle className="text-3xl text-red-700">{stats.usersCount}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardDescription>Commandes</CardDescription>
                  <CardTitle className="text-3xl text-red-700">{stats.ordersCount}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardDescription>Commandes payees</CardDescription>
                  <CardTitle className="text-3xl text-red-700">{stats.paidOrdersCount}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-red-100 shadow-sm shadow-red-100/40">
                <CardHeader>
                  <CardDescription>Commandes preparees</CardDescription>
                  <CardTitle className="text-3xl text-red-700">{stats.preparedOrdersCount}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
