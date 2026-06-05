import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getAuthToken } from "@/lib/getAuthToken";
import { notFound } from "next/navigation";
import { StoreProducts } from "./store-products";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function StorePage({ params }: Props) {
  const { username } = await params;
  const token = await getAuthToken();

  const { store, products, canManageStore } = await fetchQuery(
    api.products.getStorePage,
    { username },
    token ? { token } : undefined
  );

  if (!store) {
    notFound();
  }
  return (
    <div className="StoraPage">
      <StoreProducts
        store={store}
        products={products}
        canManageStore={canManageStore}
      />
    </div>
  );
}
