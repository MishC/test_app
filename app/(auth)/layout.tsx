import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "./sidebar";

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

export default function AuthLayout({ children }: Props) {
  return (
    <div
      className={`flex min-h-svh bg-zinc-50 dark:bg-black ${geistSans.variable} ${geistMono.variable}`}
    >
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </div>

      <main className="flex w-full pb-2 lg:pl-64 lg:pr-4 lg:pt-2">
        <div className="grow bg-white p-6 lg:rounded-lg lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          {children}
        </div>
      </main>
    </div>
  );
}