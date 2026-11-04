"use client";

import { signOut } from "next-auth/react";
import { Edit, LogOutIcon, Package, Save, Settings } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { deleteAccount, updateProfile } from "./action";
import ChangePasswordDialog from "./ChangePasswordDialog";

type ProfilInterfaceProps = {
  initialTab: "account" | "commande";
  user: {
    email: string;
    name: string | null;
    surName: string | null;
    hasPassword: boolean;
    orders: {
      id: number;
      status: "pending" | "paid" | "failed" | "cancelled";
      totalAmount: number;
      createdAt: string;
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
        amount: number;
        currency: string;
      } | null;
    }[];
  };
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function getOrderStatusLabel(
  status: ProfilInterfaceProps["user"]["orders"][number]["status"],
) {
  switch (status) {
    case "paid":
      return "Payee";
    case "pending":
      return "En attente";
    case "failed":
      return "Echouee";
    case "cancelled":
      return "Annulee";
    default:
      return status;
  }
}

function getOrderStatusClass(
  status: ProfilInterfaceProps["user"]["orders"][number]["status"],
) {
  switch (status) {
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "cancelled":
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

function getTransactionStatusLabel(
  status: NonNullable<
    ProfilInterfaceProps["user"]["orders"][number]["transaction"]
  >["status"],
) {
  switch (status) {
    case "succeeded":
      return "Transaction reussie";
    case "pending":
      return "Transaction en attente";
    case "failed":
      return "Transaction echouee";
    case "cancelled":
      return "Transaction annulee";
    default:
      return status;
  }
}

export default function ProfilInterface({
  initialTab,
  user,
}: ProfilInterfaceProps) {
  const [edit, InEdit] = useState("");
  const [displayName, setDisplayName] = useState(user.name ?? "");
  const [displaySurName, setDisplaySurName] = useState(user.surName ?? "");
  const [valueName, OnValueName] = useState("");
  const [valueSurName, OnValueSurName] = useState("");
  const [error, setError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function handleSave() {
    if (edit === "name") {
      const result = await updateProfile({ name: valueName });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setError("");
      setDisplayName(result.user.name ?? "");
    }

    if (edit === "surName") {
      const result = await updateProfile({ surName: valueSurName });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setError("");
      setDisplaySurName(result.user.surName ?? "");
    }

    InEdit("");
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const result = await deleteAccount(
        user.hasPassword
          ? { password: deletePassword }
          : { confirmation: deleteConfirmation },
      );

      if (!result.success) {
        setDeleteError(result.message);
        setDeleteLoading(false);
        return;
      }
    } catch {
      setDeleteError("Une erreur est survenue, veuillez réessayer.");
      setDeleteLoading(false);
      return;
    }

    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteConfirmation("");
    await signOut({ callbackUrl: "/" });
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-linear-to-b from-red-50 via-white to-zinc-100 px-4 py-6 dark:bg-black sm:px-6 lg:px-10 xl:px-16">
      <div className="w-full max-w-6xl">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className=" w-full   border border-red-100 bg-red-50/80 p-4 px-1">
            <TabsTrigger
              value="account"
              className="w-full p-3 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Settings /> Mon compte
            </TabsTrigger>
            <TabsTrigger
              value="commande"
              className="p-3 w-full data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Package /> Mes commande
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-8">
            <h2 className="pt-6 text-xl font-medium text-red-700 sm:pt-8">
              Parametre du compte
            </h2>

            <Card className="border-red-100 shadow-sm shadow-red-100/40">
              <CardHeader>
                <CardTitle className="text-red-700">
                  Informations personelles
                </CardTitle>
                <CardDescription>
                  Gerez vos informations personnelles
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <label className="ps-1 text-[16px] font-medium text-gray-700">
                    Nom
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {edit === "name" ? (
                      <>
                        <input
                          type="text"
                          className="flex-1 rounded-lg border bg-[#f3f3f5] px-4 py-2"
                          value={valueName}
                          onChange={(e) => OnValueName(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          onClick={handleSave}
                          className="w-full sm:w-auto"
                        >
                          <Save className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="flex-1 rounded-lg border bg-[#f3f3f5] px-4 py-2"
                          readOnly
                          value={displayName}
                        />
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            OnValueName(displayName);
                            InEdit("name");
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  <label className="ps-1 text-[16px] font-medium text-gray-700">
                    Prenom
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {edit === "surName" ? (
                      <>
                        <input
                          type="text"
                          className="flex-1 rounded-lg border bg-[#f3f3f5] px-4 py-2"
                          value={valueSurName}
                          onChange={(e) => OnValueSurName(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          onClick={handleSave}
                          className="w-full sm:w-auto"
                        >
                          <Save className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="flex-1 rounded-lg border bg-[#f3f3f5] px-4 py-2"
                          readOnly
                          value={displaySurName}
                        />
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            OnValueSurName(displaySurName);
                            InEdit("surName");
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  <label className="ps-1 text-[16px] font-medium text-gray-700">
                    Adresse mail
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border bg-[#f3f3f5] px-4 py-2"
                      readOnly
                      value={user.email ?? ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100 shadow-sm shadow-red-100/40">
              <CardHeader>
                <CardTitle className="text-red-700">Securite</CardTitle>
                <CardDescription>
                  Gerez votre mot de passe et securite
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.hasPassword ? (
                  <ChangePasswordDialog />
                ) : (
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                    Vous vous connectez avec Google : votre mot de passe se
                    gère directement depuis votre compte Google.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-sm shadow-red-100/40">
              <CardHeader>
                <CardTitle className="text-red-500">Suppression</CardTitle>
                <CardDescription>
                  Actions irreversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOutIcon />
                  Se deconnecter
                </Button>

                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) {
                      setDeletePassword("");
                      setDeleteConfirmation("");
                      setDeleteError("");
                      setDeleteLoading(false);
                    }
                  }}
                >
                  <DialogTrigger className="w-full" asChild>
                    <Button variant="destructive" className="w-full">
                      Supprimer mon compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Supprimer mon compte</DialogTitle>
                      <DialogDescription>
                        Cette action est définitive. Vos informations
                        personnelles, votre panier et vos favoris seront
                        effacés. Si vous avez déjà commandé, vos commandes sont
                        conservées de façon anonyme pour nos obligations
                        comptables.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      className="space-y-4"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void handleDeleteAccount();
                      }}
                    >
                      {deleteError ? (
                        <div
                          role="alert"
                          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          {deleteError}
                        </div>
                      ) : null}

                      {user.hasPassword ? (
                        <div className="space-y-1.5">
                          <label htmlFor="delete-password" className="text-sm font-medium text-zinc-700">
                            Confirmez avec votre mot de passe
                          </label>
                          <input
                            id="delete-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border bg-[#f3f3f5] px-4 py-2"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label htmlFor="delete-confirmation" className="text-sm font-medium text-zinc-700">
                            Écrivez <strong>SUPPRIMER</strong> pour confirmer
                          </label>
                          <input
                            id="delete-confirmation"
                            type="text"
                            autoComplete="off"
                            required
                            className="w-full rounded-lg border bg-[#f3f3f5] px-4 py-2"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                          />
                        </div>
                      )}

                      <DialogFooter className="gap-2 sm:gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Annuler
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={deleteLoading}
                        >
                          {deleteLoading
                            ? "Suppression..."
                            : "Supprimer définitivement"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commande" className="space-y-6 pt-8">
            <h2 className="text-xl font-medium text-red-700">Mes commandes</h2>

            {user.orders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
                Pas de commande effectuee
              </p>
            ) : (
              user.orders.map((order) => (
                <Card
                  key={order.id}
                  className="border-red-100 shadow-sm shadow-red-100/40"
                >
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-red-700">
                        Commande #{order.id}
                      </CardTitle>
                      <CardDescription>
                        Passee le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>

                    <div className="space-y-2 sm:text-right">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getOrderStatusClass(order.status)}`}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <p className="text-lg font-semibold text-zinc-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                      <p className="text-sm font-medium text-zinc-700">
                        {order.items.length} article
                        {order.items.length > 1 ? "s" : ""}
                      </p>

                      <div className="mt-3 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 border-b border-zinc-200 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white">
                                {item.image ? (
                                  <div className="relative h-full w-full">
                                    <Image
                                      src={item.image}
                                      alt={item.productNameSnapshot}
                                      fill
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-xs text-zinc-400">
                                    Image
                                  </span>
                                )}
                              </div>

                              <div>
                                <p className="font-medium text-zinc-900">
                                  {item.productNameSnapshot}
                                </p>
                                <p className="text-sm text-zinc-500">
                                  Quantite : {item.quantity}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm font-medium text-zinc-700 sm:text-right">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.transaction ? (
                      <div className="rounded-lg border border-red-100 bg-white p-4 text-sm text-zinc-600">
                        <p className="font-medium text-zinc-900">
                          {getTransactionStatusLabel(order.transaction.status)}
                        </p>
                        <p className="mt-1">
                          Paiement via {order.transaction.provider} •{" "}
                          {order.transaction.currency.toUpperCase()}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
