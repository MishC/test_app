import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "./sidebar";
import { auth } from "@clerk/nextjs/server";
import { ResizableSidebarLayout } from "@/components/resizable-sidebar-layout";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  await auth.protect();
  return (
    <ResizableSidebarLayout
      sidebar={<Sidebar />}
      contentClassName="p-6 lg:p-10"
    >
      {children}
    </ResizableSidebarLayout>
  );
}
