import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Sidebar } from "./sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className={`flex min-h-svh`}>
    
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden"> <Sidebar /> </div>
        <main className="flex w-full pb-2 lg:pl-64 lg:pr-4 lg:pt-2">
            <div className="bg-white grow p-6 lg:rounded-lg lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zing-950/5">{children}</div></main>
    </div>
  );
}
