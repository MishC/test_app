import { ContentLayout } from "../content-layout";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { LibraryCard } from "./library-card";

export default async function Library() {
  const token = await getAuthToken();
  if (!token) {
    return <div></div>;
  }

  const products = await fetchQuery(api.library.getLibraryProducts, {}, { token });

  return (
    <ContentLayout
      title="Library"
      description="View all your purchased products"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(({ product, store }) => (
          <LibraryCard key={product._id} product={product} store={store} />
        ))}
      </div>
    </ContentLayout>
  );
}
