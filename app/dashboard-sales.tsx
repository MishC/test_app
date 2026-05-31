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
        <div>
          <div className="relative flex h-72 items-end gap-3 rounded-md border border-border px-4 pb-4 pt-10">
            <div className="pointer-events-none absolute inset-4 top-10 bg-[linear-gradient(to_top,var(--border)_1px,transparent_1px)] bg-[length:100%_25%] opacity-60" />
            {sales.map((sale) => {
              const height = (sale.revenue / maxRevenue) * 100;

              return (
                <div key={sale.date} className="relative z-10 flex h-full flex-1 flex-col justify-end">
                  <span className="mb-2 min-h-4 text-center text-xs font-medium tabular-nums">
                    {sale.revenue > 0 ? formatPrice({ price: sale.revenue }) : ""}
                  </span>
                  {sale.revenue > 0 ? (
                    <div
                      className="rounded-t-md bg-green-600"
                      style={{ height: `${height}%` }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-3 px-4">
            {sales.map((sale) => (
              <span key={sale.date} className="text-center text-xs text-muted-foreground">
                {sale.day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
