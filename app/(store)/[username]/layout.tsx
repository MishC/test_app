import { StoreLayoutShell } from "./store-layout-shell";

type Props = {
  children: React.ReactNode;
};

export default function StoreLayout({ children }: Props) {
  return <StoreLayoutShell>{children}</StoreLayoutShell>;
}
