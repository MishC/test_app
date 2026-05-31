import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";

type DashboardSale = {
  day: string;
  date: string;
  revenue: number;
};

export function DashboardSales({ sales }: { sales: DashboardSale[] }) {
  if (!sales.length) {
    return null;
  }

  const maxRevenue = Math.max(...sales.map((sale) => sale.revenue), 1);

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          {sales[0].date} to {sales[sales.length - 1].date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-end gap-3 border-b border-l border-border px-3 pt-8">
          {sales.map((sale) => {
            const height = sale.revenue === 0 ? 2 : (sale.revenue / maxRevenue) * 100;

            return (
              <div key={sale.date} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="flex h-full flex-col justify-end">
                  <span className="mb-1 text-center text-xs font-medium tabular-nums">
                    {sale.revenue > 0 ? formatPrice({ price: sale.revenue }) : ""}
                  </span>
                  <div
                    className="min-h-0.5 rounded-t-md bg-green-600"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="pb-2 text-center text-xs text-muted-foreground">
                  {sale.day.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
