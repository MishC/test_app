"use client";
import {
  Package2,
  BarChart,
  CreditCard,
  ShoppingBasket,
  Cog,
  History,
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
  const isAdmin = currentUser?.role === "admin";
  const customerLinks = [
    {
      label: "Store",
      href: currentUser?.username ? `/${currentUser.username}` : "/settings",
      icon: Store,
    },
    {
      label: "History",
      href: "/history",
      icon: History,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Cog,
    },
  ];
  const adminLinks = [
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
    ...customerLinks,
    {
      label: "Sales",
      href: "/sales",
      icon: CreditCard,
    },
  ];
  const links = isAdmin ? adminLinks : customerLinks;
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
      <div className="flex h-14 min-w-0 items-center overflow-hidden border-t px-4 pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="min-w-0 flex-1 outline-none">
            <div className="flex min-w-0 items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="shrink-0">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || ""}
                  />
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <p className="w-full truncate text-left text-sm font-medium text-zinc-950">
                    {user?.fullName}
                  </p>
                  <p className="w-full truncate text-left text-sm font-normal text-zinc-500">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              <ChevronUp className="ml-2 size-4 shrink-0 text-zinc-500"></ChevronUp>
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
