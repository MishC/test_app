import { ResizableSidebarLayout } from "@/components/resizable-sidebar-layout";
import { Sidebar } from "../../(auth)/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function StoreLayout({ children }: Props) {
  return (
    <ResizableSidebarLayout sidebar={<Sidebar />}>
      {children}
    </ResizableSidebarLayout>
  );
}
