import { Sidebar } from "../../(auth)/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function StoreLayout({ children }: Props) {
  return (
    <div className="flex min-h-svh bg-zinc-50 dark:bg-black">
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </div>

      <main className="flex w-full pb-2 lg:pl-64 lg:pr-4 lg:pt-2">
        <div className="grow bg-white lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          {children}
        </div>
      </main>
    </div>
  );
}
