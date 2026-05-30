"use client";
import {
  Package2,
  BarChart,
  CreditCard,
  ShoppingBasket,
  Cog,
  Library,
  ChevronUp,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";  
import { useConvexAuth, useQuery } from "convex/react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.getUser,
    isAuthenticated ? {} : "skip",
  );
 
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: BarChart,
    },
    {
      label: "Products",
      href: "/products",
      icon: ShoppingBasket,
    },
    {
      label: "Store",
      href: currentUser?.username ? `/${currentUser.username}` : "/settings",
      icon: Store,
    },
    {
      label: "Sales",
      href: "/sales",
      icon: CreditCard,
    },
    {
      label: "Library",
      href: "/library",
      icon: Library,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Cog,
    },
    
  ];
  return (
    <div className="flex flex-col justify-between h-screen">
      <div>
        <div className="flex h-14 mb-4 items-center border-b px-4 gap-2 align-top">
          <Link href="/" className="flex items-center gap-4 font-semibold">
            <Package2 className="size-6" />
          </Link>
          <span>Next Store</span>
        </div>

        <nav className="grid gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant: pathname === link.href ? "default" : "ghost",
                }),
                "justify-start",
                pathname !== link.href && "hover:bg-zinc-200",
              )}
            >
              <link.icon className="size-4 mr-2" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center align-bottom  border-t h-14 px-4 pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || ""}
                  />
                </Avatar>
                <div className="flex flex-col item-start-w-[150px] justif-start truncate">
                  <p className="text-sm font-medium  text-zinc-950">
                    {user?.fullName}
                  </p>
                  <p className="text-sm font-normal text-zinc-500">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              <ChevronUp className="size-4 ml-2 text-zinc-500"></ChevronUp>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-62.5 mb-4" align="start">
            <DropdownMenuLabel className=" text-md font-bold text-zinc-950">
              My Account
            </DropdownMenuLabel>
            <Link href="/profile" className=" hover:bg-zinc-100 rounded-sm">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />

            <SignOutButton redirectUrl="/sign-in">
              
              <DropdownMenuItem className=" hover:bg-zinc-100 rounded-sm">
                Logout
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
