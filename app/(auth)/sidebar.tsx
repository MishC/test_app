"use client";
import {
  Package2,
  BarChart,
  CreditCard,
  ShoppingBasket,
  Cog,
  Library,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils";

export function Sidebar() {
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
    <div className="flex flex-col justify-between">

      <div className="flex h-14 mb-4 items-center border-b px-4 gap-2">
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
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "justify-start")}
          >
            <link.icon className="size-4 mr-2" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
