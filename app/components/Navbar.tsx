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
import { isAdminEmail } from "@/lib/admin-emails";
import { navLinks } from "./nav-links";

export default function Navbar({ cartItemsCount }: { cartItemsCount: number }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const canAccessAdmin = isAdminEmail(session?.user?.email);

  const accountHref = session?.user ? "/Profil" : "/LogIn";

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="border-b bg-white">
      <nav className="flex items-center justify-between px-4 py-2 md:px-8 lg:px-12">
        <Link href="/" onClick={closeMobileMenu} data-name="nav-logo-home" aria-label="Accueil Autoshop65">
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
              data-name={`nav-link-${label.toLowerCase().replaceAll(" ", "-")}`}
              className={`flex items-center gap-2 hover:text-red-500 hover:underline ${
                pathname === href ? "text-red-700" : ""
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon-lg" data-name="nav-favorites-button" aria-label="Favoris">
            <Heart className="size-6" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-lg" data-name="nav-account-menu-trigger" aria-label="Mon compte">
                <User className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {session?.user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/Profil" data-name="nav-account-link">
                        <BadgeCheckIcon />
                        Mon compte
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/Profil?tab=commande" data-name="nav-orders-link">
                        <CreditCardIcon />
                        Mes commandes
                      </Link>
                    </DropdownMenuItem>
                    {canAccessAdmin ? (
                      <DropdownMenuItem asChild>
                        <Link href="/Admin" data-name="nav-admin-link">
                          <ShieldCheckIcon />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/LogIn" data-name="nav-login-account-link">
                      <BadgeCheckIcon />
                      Mon compte
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {session?.user ? (
                <DropdownMenuItem onClick={() => signOut()} data-name="nav-logout-button">
                  <LogOutIcon />
                  Se deconnecter
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/LogIn" data-name="nav-login-link">
                    <LogInIcon />
                    Se connecter
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost" size="icon-lg" className="relative">
            <Link
              href="/Cart"
              data-name="nav-cart-link"
              aria-label={cartItemsCount > 0 ? `Panier (${cartItemsCount} article${cartItemsCount > 1 ? "s" : ""})` : "Panier"}
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
              {cartItemsCount > 0 ? (
                <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center bg-red-500 p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              ) : null}
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon-lg"
          className="lg:hidden"
          data-name="nav-mobile-menu-open"
          aria-label="Ouvrir le menu"
          aria-expanded={isMobileMenuOpen}
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
            data-name="nav-mobile-menu-overlay"
            onClick={closeMobileMenu}
          />

          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-100 px-4 py-4">
              <p className="text-lg font-semibold text-red-700">Menu</p>
              <Button variant="ghost" size="icon-lg" data-name="nav-mobile-menu-close" aria-label="Fermer le menu" onClick={closeMobileMenu}>
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
                    data-name={`nav-mobile-link-${label.toLowerCase().replaceAll(" ", "-")}`}
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
                      data-name="nav-mobile-orders-link"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-zinc-800 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <CreditCardIcon className="size-5" />
                      Mes commandes
                    </Link>
                    {canAccessAdmin ? (
                      <Link
                        href="/Admin"
                        onClick={closeMobileMenu}
                        data-name="nav-mobile-admin-link"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-zinc-800 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <ShieldCheckIcon className="size-5" />
                        Administration
                      </Link>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            <div className="border-t border-red-100 px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  data-name="nav-mobile-favorites-button"
                  className="h-auto flex-col gap-2 border-red-100 py-3 text-zinc-700"
                >
                  <Heart className="size-5 text-red-500" />
                  <span className="text-xs">Favoris</span>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 border-red-100 py-3 text-zinc-700"
                >
                  <Link href={accountHref} onClick={closeMobileMenu} data-name="nav-mobile-account-link">
                    <User className="size-5 text-red-500" />
                    <span className="text-xs">Compte</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="relative h-auto w-full flex-col gap-2 border-red-100 py-3 text-zinc-700"
                >
                  <Link href="/Cart" onClick={closeMobileMenu} data-name="nav-mobile-cart-link">
                    <ShoppingCart className="size-5 text-red-500" />
                    <span className="text-xs">Panier</span>
                    {cartItemsCount > 0 ? (
                      <Badge className="absolute right-3 top-2 flex size-5 items-center justify-center bg-red-500 p-0 text-xs">
                        {cartItemsCount}
                      </Badge>
                    ) : null}
                  </Link>
                </Button>
              </div>

              {session?.user ? (
                <Button
                  variant="ghost"
                  data-name="nav-mobile-logout-button"
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
                <Button
                  asChild
                  variant="ghost"
                  className="mt-3 w-full justify-center text-zinc-600 hover:bg-red-50 hover:text-red-600"
                >
                  <Link href="/LogIn" onClick={closeMobileMenu} data-name="nav-mobile-login-link">
                    <LogInIcon className="size-4" />
                    Se connecter
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
