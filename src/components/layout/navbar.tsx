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
import { List, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
// import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const { userId } = useAuth();
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
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
            {/* New Seasons Link */}
          </NavigationMenuList>
        </NavigationMenu>


        <div className="relative flex items-center justify-center">
          <Input
            type="search"
            placeholder="Search anime..."
            value={query}
            onChange={handleInputChange}
            className="rounded-full w-[200px] sm:w-[250px] shadow-md focus:ring-2 focus:ring-primary/50"
          />
          <div className="fixed top-0 translate-y-12 left-0 right-0">
            <SearchResults query={query} setQuery={setQuery} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <SignedIn>
            <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link href={`/animelist/${userId}`} label="My List" labelIcon={<List className="size-4" />} />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton appearance={{ baseTheme: dark }} mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
