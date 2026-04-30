"use client";
import {
  Package2,
  BarChart,
  CreditCard,
  ShoppingBasket,
  Cog,
  Library,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
     DropdownMenuLabel, DropdownMenuSeparator, 
     DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";


export function Sidebar() {
    const pathname = usePathname();
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
      label: "Sales",
      href: "/sales",
      icon: CreditCard,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Cog,
    },
    {
      label: "Library",
      href: "/library",
      icon: Library,
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
            key={link.href}
            href={link.href}
            className={cn(buttonVariants({ variant: pathname === link.href ? "default" : "ghost" }), "justify-start",
        pathname!== link.href && "hover:bg-zinc-200")}
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
                                <AvatarImage src="https://avatars.githubusercontent.com/u/5074489?s=400&u=1c8e5b0a7c3d2e4f1a9b8c9e5d6f7a8b9c0d1e&v=3" />
                            </Avatar>
                            <div className="flex flex-col item-start-w-[150px] justif-start truncate">
                                <p className="text-sm font-medium  text-zinc-950">Full Name</p>
                                <p className="text-sm font-normal text-zinc-500">john.doe@example.com</p>
                               
                            </div>
                        </div> 
                        <ChevronUp className="size-4 ml-2 text-zinc-500"></ChevronUp>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-62.5 mb-4" align="start">
                    <DropdownMenuLabel className=" text-md font-bold text-zinc-950">My Account</DropdownMenuLabel>
                    <Link href="/profile" className=" hover:bg-zinc-100 rounded-sm"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                                        <DropdownMenuSeparator />

                
                   
                    <Link href="/logout" className=" hover:bg-zinc-100 rounded-sm"> 
                    <DropdownMenuItem>Logout</DropdownMenuItem></Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
}
