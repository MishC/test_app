import {
  getProductsByClerkId,
  getPublishedProducts,
  getSalesByProductId,
  getClerkIdOrNull,
  getUserByClerkId,
  getUserByUsername,
  mutationWithUser,
  queryWithUser,
  requireAdmin,
} from "./utils";
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

const MINIMUM_PRODUCT_PRICE_USD = 0.5;
const MINIMUM_PRODUCT_AMOUNT = 0;

function normalizeProductAmount(amount: number) {
  if (!Number.isInteger(amount) || amount < MINIMUM_PRODUCT_AMOUNT) {
    throw new ConvexError("Amount must be a whole number greater than or equal to 0");
  }

  return amount;
}

export const getProduct = queryWithUser({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, { productId }) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    const product = await ctx.db.get(productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    if (ctx.clerkId !== product.clerkId) {
      throw new ConvexError("Unauthorized");
    }

    return product;
  },
});

export const getProducts = queryWithUser({
  args: {},
  handler: async (ctx) => {
    const user = await requireAdmin(ctx.db, ctx.clerkId);
    const products = await getProductsByClerkId(ctx.db, ctx.clerkId);

    const productsWithRevenue = await Promise.all(
      products.map(async (product) => {
        const sales = await getSalesByProductId(ctx.db, product._id);

        return {
          ...product,
          sales: sales.length,
          user,
          revenue: sales.reduce((acc, sale) => acc + sale.price, 0),
        };
      })
    );

    return productsWithRevenue;
  },
});

export const createProduct = mutationWithUser({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    coverImage: v.string(),
    content: v.string(),
    published: v.boolean(),
    amount: v.number(),
  },
  handler: async (
    ctx,
    { name, description, price, coverImage, content, published, amount }
  ) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    if (price < MINIMUM_PRODUCT_PRICE_USD) {
      throw new ConvexError("Price must be at least $0.50");
    }

    const normalizedAmount = normalizeProductAmount(amount);

    await ctx.db.insert("products", {
      clerkId: ctx.clerkId,
      name,
      description,
      currency: "USD",
      price: Number(price.toFixed(2)),
      coverImage,
      content,
      published,
      amount: normalizedAmount,
    });
  },
});

export const updateProduct = mutationWithUser({
  args: {
    productId: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    coverImage: v.string(),
    content: v.string(),
    published: v.boolean(),
    amount: v.number(),
  },
  handler: async (
    ctx,
    { productId, name, description, price, coverImage, content, published, amount }
  ) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    if (price < MINIMUM_PRODUCT_PRICE_USD) {
      throw new ConvexError("Price must be at least $0.50");
    }

    const normalizedAmount = normalizeProductAmount(amount);

    const product = await ctx.db.get(productId);

    if (ctx.clerkId !== product?.clerkId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(productId, {
      clerkId: ctx.clerkId,
      name,
      description,
      currency: "USD",
      price: Number(price.toFixed(2)),
      coverImage,
      content,
      published,
      amount: normalizedAmount,
    });
  },
});

export const setProductPublished = mutationWithUser({
  args: {
    productId: v.id("products"),
    published: v.boolean(),
  },
  handler: async (ctx, { productId, published }) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    const product = await ctx.db.get(productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    if (ctx.clerkId !== product.clerkId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(productId, { published });
  },
});

export const deleteProduct = mutationWithUser({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    const product = await ctx.db.get(productId);

    if (ctx.clerkId !== product?.clerkId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(productId);
  },
});

export const getStorePage = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const store = await getUserByUsername(ctx.db, username);

    if (!store) {
      return {
        store: null,
        products: [],
      };
    }

    const clerkId = await getClerkIdOrNull(ctx);
    const currentUser = clerkId
      ? await getUserByClerkId(ctx.db, clerkId)
      : null;
    const canManageStore =
      currentUser?.role === "admin" && currentUser.clerkId === store.clerkId;

    const publishedProducts = await getPublishedProducts(ctx.db);
    const products = canManageStore
      ? [
          ...new Map(
            [
              ...publishedProducts,
              ...(await getProductsByClerkId(ctx.db, store.clerkId)),
            ].map((product) => [product._id, product])
          ).values(),
        ]
      : publishedProducts;

    return {
      store,
      products,
      canManageStore,
    };
  },
});

export const getStoreProduct = query({
  args: {
    username: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, { username, productId }) => {
    const store = await getUserByUsername(ctx.db, username);

    if (!store) {
      return null;
    }

    const product = await ctx.db.get(productId);

    if (!product) {
      return null;
    }

    const clerkId = await getClerkIdOrNull(ctx);
    const currentUser = clerkId
      ? await getUserByClerkId(ctx.db, clerkId)
      : null;
    const canManageProduct =
      currentUser?.role === "admin" &&
      currentUser.clerkId === store.clerkId &&
      currentUser.clerkId === product.clerkId;

    if (!product.published && !canManageProduct) {
      return null;
    }

    const user = await getUserByClerkId(ctx.db, product.clerkId);
    const sales = await getSalesByProductId(ctx.db, productId);

    return { ...product, user, sales: sales.length };
  },
});
