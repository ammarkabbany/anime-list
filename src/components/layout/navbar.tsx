"use client"
import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { dark } from "@clerk/themes";
import SearchResults from "../search-results";
// import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const {userId} = useAuth();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href="/" passHref>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <SignedIn>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href={`/animelist/${userId}`} passHref>
                    My List
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </SignedIn>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="absolute left-1/2 -translate-x-1/2 top-2">
          <SearchResults />
        </div>

        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <SignedIn>
            <UserButton appearance={{baseTheme: dark}} afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton appearance={{baseTheme: dark}} mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
