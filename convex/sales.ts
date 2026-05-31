import { getSalesByStoreClerkId, getProductsByClerkId, queryWithUser } from "./utils";
import { formatPrice } from "../lib/formatPrice"
import { Doc } from "./_generated/dataModel";
import dayjs from 'dayjs';

export const getDashboardData = queryWithUser({
    args: {},
    handler: async (ctx) => {
        const [sales, products] = await Promise.all([
            getSalesByStoreClerkId(ctx.db, ctx.clerkId),
            getProductsByClerkId(ctx.db, ctx.clerkId),
        ]);

        const revenue = sales.reduce((acc, sale) => acc + sale.price, 0);
        const oneWeekAgo = dayjs().subtract(7, 'day');
        const recentSales = sales.filter(sale => dayjs(sale._creationTime).isAfter(oneWeekAgo));
        const chartSales = getPast7Days().map(({ date, day }) => ({
            day,
            date,
            revenue: calculateRevenueForDay(day, recentSales),
        }));

        return {
            stats: {
                totalRevenue: formatPrice({ price: revenue }),
                totalSales: sales.length,
                totalProducts: products.length,
            },
            sales: chartSales,
        };
    },
});

export const getDashboardStats = queryWithUser({
    args: {},
    handler: async (ctx) => {
        const sales = await getSalesByStoreClerkId(ctx.db, ctx.clerkId!);
        const products = await getProductsByClerkId(ctx.db, ctx.clerkId);

        const revenue = sales?.reduce((acc, sale) => acc + sale.price, 0);
        const formattedRevenue = formatPrice({ price: revenue });
        return { totalRevenue: formattedRevenue, totalSales: sales.length, totalProducts: products.length, }

    }
})


export const getDashboardSales = queryWithUser({
    args: {},
    handler: async (ctx) => {
        const sales = await getSalesByStoreClerkId(ctx.db, ctx.clerkId);
        const oneWeekAgo = dayjs()?.subtract(7, 'day');
        const recentSales = sales.filter(sale => dayjs(sale._creationTime).isAfter(oneWeekAgo));
        const past7Days = getPast7Days();
        const salesByDay = past7Days.map(({ date, day }) => { return { day, date, revenue: calculateRevenueForDay(day, recentSales) } });
        return salesByDay;
    }

})
function calculateRevenueForDay(dayName: string, sales: Doc<"sales">[]) {

    return sales.filter(sale => dayjs(sale._creationTime).format('dddd') === dayName)
        .reduce((acc, sale) => acc + sale.price, 0)

}
function getPast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format("YYYY-MM-DD");
        const day = dayjs().subtract(i, "day").format("dddd");
        days.push({ date, day })
    }
    return days
}

type Args = {
    price: number; currency: string;
}


