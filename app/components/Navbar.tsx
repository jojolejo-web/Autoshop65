"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  CreditCardIcon,
  Heart,
  LogInIcon,
  LogOutIcon,
  Menu,
  ShieldCheckIcon,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { navLinks } from "./nav-links";

export default function Navbar({ cartItemsCount }: { cartItemsCount: number }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const accountHref = session?.user ? "/Profil" : "/LogIn";

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="border-b bg-white">
      <nav className="flex items-center justify-between px-4 py-2 md:px-8 lg:px-12">
        <Link href="/" onClick={closeMobileMenu}>
          <Image
            src="/logoAutoshop65.png"
            width={100}
            height={100}
            alt="Logo Autoshop65"
          />
        </Link>

        <div className="hidden items-center gap-12 lg:flex">
          {navLinks.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 hover:text-red-500 hover:underline ${
                pathname === href ? "text-red-500" : ""
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon-lg">
            <Heart className="size-6" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <User className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {session?.user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/Profil">
                        <BadgeCheckIcon />
                        Mon compte
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/Profil?tab=commande">
                        <CreditCardIcon />
                        Mes commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/Admin">
                        <ShieldCheckIcon />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/LogIn">
                      <BadgeCheckIcon />
                      Mon compte
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {session?.user ? (
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOutIcon />
                  Se deconnecter
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/LogIn">
                    <LogInIcon />
                    Se connecter
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/Cart">
            <Button variant="ghost" size="icon-lg" className="relative">
              <ShoppingCart className="size-5" />
              {cartItemsCount > 0 ? (
                <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center bg-red-500 p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              ) : null}
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon-lg"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="size-6" />
        </Button>
      </nav>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
          />

          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-100 px-4 py-4">
              <p className="text-lg font-semibold text-red-700">Menu</p>
              <Button variant="ghost" size="icon-lg" onClick={closeMobileMenu}>
                <X className="size-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-2">
                {navLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-colors ${
                      pathname === href
                        ? "bg-red-50 text-red-600"
                        : "text-zinc-800 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                ))}

                {session?.user ? (
                  <>
                    <Link
                      href="/Profil?tab=commande"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-zinc-800 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <CreditCardIcon className="size-5" />
                      Mes commandes
                    </Link>
                    <Link
                      href="/Admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-zinc-800 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <ShieldCheckIcon className="size-5" />
                      Administration
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            <div className="border-t border-red-100 px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto flex-col gap-2 border-red-100 py-3 text-zinc-700"
                >
                  <Heart className="size-5 text-red-500" />
                  <span className="text-xs">Favoris</span>
                </Button>

                <Link href={accountHref} onClick={closeMobileMenu}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-full flex-col gap-2 border-red-100 py-3 text-zinc-700"
                  >
                    <User className="size-5 text-red-500" />
                    <span className="text-xs">Compte</span>
                  </Button>
                </Link>

                <Link href="/Cart" onClick={closeMobileMenu}>
                  <Button
                    type="button"
                    variant="outline"
                    className="relative h-auto w-full flex-col gap-2 border-red-100 py-3 text-zinc-700"
                  >
                    <ShoppingCart className="size-5 text-red-500" />
                    <span className="text-xs">Panier</span>
                    {cartItemsCount > 0 ? (
                      <Badge className="absolute right-3 top-2 flex size-5 items-center justify-center bg-red-500 p-0 text-xs">
                        {cartItemsCount}
                      </Badge>
                    ) : null}
                  </Button>
                </Link>
              </div>

              {session?.user ? (
                <Button
                  variant="ghost"
                  className="mt-3 w-full justify-center text-zinc-600 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    closeMobileMenu();
                    signOut();
                  }}
                >
                  <LogOutIcon className="size-4" />
                  Se deconnecter
                </Button>
              ) : (
                <Link href="/LogIn" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full justify-center text-zinc-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogInIcon className="size-4" />
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
