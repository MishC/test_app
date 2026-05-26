import { getProductsByClerkId, getSalesByProductId, getUserByClerkId, getUserByUsername, mutationWithUser } from "./utils";
import { v } from "convex/values";
import { queryWithUser } from "./utils";
import { Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

const MINIMUM_PRODUCT_PRICE_USD = 0.5;

export const getProduct = queryWithUser({
    args: {
        productId: v.id("products"),
    },
    handler: async (ctx, { productId }) => {
        const product = await ctx.db.get(productId as Id<'products'>);

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
        const user = await getUserByClerkId(ctx.db, ctx.clerkId!);
        const products = getProductsByClerkId(ctx.db, ctx.clerkId!)

        const productsWithRevenue = await Promise.all((await products).map(async product => {
            const sales = await getSalesByProductId(ctx.db, product._id);
            return {
                ...product,
                sales: sales.length,
                user,
                revenue: sales.reduce((acc, sale) => acc + sale.price, 0)
            }

        }))
        return productsWithRevenue;
    }
})

export const createProduct = mutationWithUser({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        coverImage: v.string(),
        content: v.string(),
        published: v.boolean()
    },
    handler: async (ctx, { name, description, price, coverImage, content, published }) => {
        if (price < MINIMUM_PRODUCT_PRICE_USD) {
            throw new ConvexError("Price must be at least $0.50");
        }

        await ctx.db.insert("products", {
            clerkId: ctx.clerkId,
            name,
            description,
            currency: "USD",
            price: Number(price.toFixed(2)),

            coverImage,
            content,
            published,

        })
    }
})


export const updateProduct = mutationWithUser({
    args: {
        productId: v.id("products"),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        coverImage: v.string(),
        content: v.string(),
        published: v.boolean()
    },
    handler: async (ctx, { productId, name, description, price, coverImage, content, published }) => {
        if (price < MINIMUM_PRODUCT_PRICE_USD) {
            throw new ConvexError("Price must be at least $0.50");
        }

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

        })
    }
})


export const deleteProduct = mutationWithUser({
    args: { productId: v.id("products") },
    handler: async (ctx, { productId }) => {
        const product = await ctx.db.get(productId);
        if (ctx.clerkId !== product?.clerkId) { throw new ConvexError("Unauthorized") }
        await ctx.db.delete(productId);
    }
}
    );


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

    const products = await getProductsByClerkId(ctx.db, store.clerkId);

    return {
      store,
      products,
    };
  },
});

export const getStoreProduct= query({
args:{productId:v.id('products')},
handler:async(ctx,{productId})=>{
    const product=await ctx.db.get(productId!);
    if (!product)
    {return null}
const user= await getUserByClerkId(ctx.db,product.clerkId);
const sales= await getSalesByProductId(ctx.db, productId)
    return {...product,user,sales:sales.length};
}
    })
