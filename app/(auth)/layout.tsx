import { Geist, Inter } from "next/font/google";
import { Sidebar } from "./sidebar";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const alt = Inter({
  subsets: ["latin"],
  variable: "--font-alt",
});

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div
      className={`flex min-h-svh bg-zinc-50 font-sans dark:bg-black ${sans.variable} ${alt.variable}`}
    >
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
        <Sidebar />
      </div>

      {/* Content */}
      <main className="flex w-full pb-2 lg:pl-64 lg:pr-4 lg:pt-2">
        <div className="grow bg-white p-6 lg:rounded-lg lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          {children}
        </div>
      </main>
    </div>
  );
}