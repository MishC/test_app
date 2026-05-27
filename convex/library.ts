import {
  getSalesByCustomerClerkId,
  getUserByClerkId,
  queryWithUser,
} from "./utils";

export const getLibraryProducts = queryWithUser({
  args: {},
  handler: async (ctx) => {
    const sales = await getSalesByCustomerClerkId(ctx.db, ctx.clerkId);

    const libraryProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await ctx.db.get(sale.productId);
        if (!product) {
          return null;
        }

        const store = await getUserByClerkId(ctx.db, product.clerkId);
        if (!store) {
          return null;
        }

        return { product, store };
      }),
    );

    return libraryProducts.filter((item) => item !== null);
  },
});
