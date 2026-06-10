"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Lock,
  MailIcon,
  MapPin,
  Package,
  Phone,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 font-medium">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-xl text-white md:size-13 md:text-2xl">
        {number}
      </div>
      <div className="min-w-0">
        <h4>{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function RetraitColis() {
  return (
    <main className="flex flex-1 flex-col items-center bg-gray-100 px-4 py-6 dark:bg-black md:px-6 lg:px-8 xl:px-12 2xl:px-20">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <Tabs defaultValue="Traditionnelle" className="w-full space-y-5">
          <TabsList className=" w-full rounded-2xl bg-gray-200 p-1">
            <TabsTrigger
              value="Traditionnelle"
              className="   text-center text-sm  md:text-base rounded-s-full"
            >
              <CreditCard /> Retrait traditionnelle
            </TabsTrigger>
            <TabsTrigger
              value="Automatique"
              className=" text-center text-sm md:text-base rounded-e-full"
            >
              <Lock /> Locker automatique amazon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Traditionnelle">
            <Card className="p-0">
              <CardHeader className="bg-red-600 py-3">
                <CardTitle className="text-lg font-medium text-white">
                  Retrait Colis
                </CardTitle>
                <CardDescription className="text-red-50">
                  Retirez vos colis en toute securite
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 py-6 sm:px-6 md:px-8">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-medium text-red-600">
                  <CheckCircle className="size-7" />
                  Documents requis
                </h3>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="border border-red-100">
                    <CardContent className="py-8">
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                          <CreditCard className="size-8 text-red-600" />
                        </div>
                        <h4 className="text-red-600">1. Carte d&apos;identite</h4>
                        <p className="text-gray-600">
                          Presentez une piece d&apos;identite valide (CNI,
                          passeport, permis de conduire)
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Obligatoire
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-100">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                          <QrCode className="size-8 text-red-600" />
                        </div>
                        <h4 className="text-red-600">2. QR Code</h4>
                        <p className="text-gray-600">
                          Montrez le QR code recu par email ou SMS
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Obligatoire
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <h3 className="mb-4 flex items-center gap-2 text-xl font-medium text-red-600">
                  <Package className="size-7" />
                  Etapes du retrait
                </h3>

                <div className="space-y-4">
                  <Step
                    number="1"
                    title="Presentez-vous au comptoir"
                    description="Rendez-vous a notre point de retrait pendant les horaires d'ouverture."
                  />
                  <Step
                    number="2"
                    title="Montrez vos documents"
                    description="Presentez votre piece d'identite et le QR code de votre colis."
                  />
                  <Step
                    number="3"
                    title="Signez le recu"
                    description="Signez le document de remise pour confirmer la reception."
                  />
                  <Step
                    number="4"
                    title="Recuperez votre colis"
                    description="Verifiez l'etat du colis avant de partir."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Automatique">
            <Card className="p-0">
              <CardHeader className="bg-red-600 py-3">
                <CardTitle className="text-lg font-medium text-white">
                  Locker Automatique amazon 24h/24
                </CardTitle>
                <CardDescription className="text-red-50">
                  Recuperez votre colis en toute autonomie, a toute heure,
                  grace a notre casier automatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 py-6 sm:px-6 md:px-8">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="border border-red-100">
                    <CardContent className="py-8">
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                          <Clock className="size-8 text-red-600" />
                        </div>
                        <h4 className="text-red-600">Disponible 24h/24</h4>
                        <p className="text-gray-600">
                          Retirez vos colis a toute heure, meme en dehors des
                          horaires d&apos;ouverture
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-red-100">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                          <Lock className="size-8 text-red-600" />
                        </div>
                        <h4 className="text-red-600">100% Securise</h4>
                        <p className="text-gray-600">
                          Vos colis sont stockes dans des casiers securises et
                          surveilles
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-red-100">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                          <CheckCircle className="size-8 text-red-600" />
                        </div>
                        <h4 className="text-red-600">Rapide et simple</h4>
                        <p className="text-gray-600">
                          Retrait en moins de 2 minutes grace au code recu par
                          SMS ou email
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <h3 className="mb-4 flex items-center gap-2 text-xl font-medium text-red-600">
                  <Package className="size-7" />
                  Comment utiliser le Locker ?
                </h3>

                <div className="space-y-4">
                  <Step
                    number="1"
                    title="Recevez votre code"
                    description="Vous recevrez un code unique a 6 chiffres par SMS et email des que votre colis est disponible dans le Locker."
                  />
                  <Step
                    number="2"
                    title="Rendez-vous au Locker"
                    description="Le Locker est accessible 24h/24, 7j/7, situe a l'exterieur de notre magasin."
                  />
                  <Step
                    number="3"
                    title="Saisissez votre code"
                    description="Sur l'ecran tactile du Locker, selectionnez 'Retirer un colis' et entrez votre code a 6 chiffres."
                  />
                  <Step
                    number="4"
                    title="Recuperez votre colis"
                    description="Le casier contenant votre colis s'ouvrira automatiquement. Recuperez votre colis et fermez la porte."
                  />
                </div>

                <Separator />

                <h3 className="mb-4 text-xl font-medium text-red-600">
                  Le Locker
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Image
                    width={500}
                    height={500}
                    src="/Locker.webp"
                    alt="Image du locker"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                  <Image
                    width={500}
                    height={500}
                    src="/LockerLoin.webp"
                    alt="Image du locker de loin"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                  <Image
                    width={500}
                    height={500}
                    src="/Lockerprès.webp"
                    alt="Image du locker de pres"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-0 pb-6">
            <CardHeader className="bg-red-600 py-4">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-white">
                <MapPin />
                Adresse du point de retrait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">AUTOSHOP 65</h4>
                <p className="text-gray-600">86 Av. Francois Mitterrand 65600 Semeac</p>
                <p className="text-gray-600">65600 Séméac</p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 flex items-center gap-2">
                  <Clock className="size-4 text-red-600" />
                  Horaires d&apos;ouverture
                </h4>
                <div className="space-y-1 text-gray-600">
                  <p>Lundi - Vendredi : 8h00 - 18h00</p>
                  <p>Dimanche - Samedi : Ferme</p>
                </div>
              </div>

              <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                Locker amazon 24h/24
              </Badge>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.2914988564503!2d0.09939377597843467!3d43.22434767112568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a9d353127102e5%3A0xdf57f9d71d01179c!2sStation%20Saint%20Christophe!5e0!3m2!1sfr!2sfr!4v1776839483888!5m2!1sfr!2sfr"
                width="600"
                height="450"
                className="h-72 w-full rounded-lg border-0 md:h-96"
                loading="lazy"
              ></iframe>
            </CardContent>
          </Card>

          <Card className="p-0 pb-6">
            <CardHeader className="bg-red-600 py-4">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-white">
                <Phone />
                Besoin d&apos;aide ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">Service client</h4>
                <p className="text-gray-600">
                  Notre equipe est a votre disposition pour toute question
                  concernant le retrait de vos colis.
                </p>
              </div>

              <Separator />

              <div className="flex w-full flex-col gap-3">
                <Button
                  variant="destructive"
                  className="flex w-full justify-start gap-4 border-2 border-red-500 bg-transparent py-4 text-base text-red-500 hover:border-red-800 hover:bg-red-500/5 md:text-lg"
                >
                  <Phone /> <Link href="tel:0562952175">05 62 95 21 75</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex w-full justify-start gap-4 border-2 border-red-500 bg-transparent py-4 text-base text-red-500 hover:border-red-800 hover:bg-red-500/5 md:text-lg"
                >
                  <MailIcon />
                  <Link href="mailto:autoshop65600@hotmail.com">
                    autoshop65600@hotmail.com
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
