import { ContentLayout } from "../content-layout";
import { SalesTable } from "./sales-table";
import { columns, Payment, PaymentStatus } from "./columns"
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

function toPaymentStatus(status: string): PaymentStatus {
  if (
    status === "pending" ||
    status === "processing" ||
    status === "success" ||
    status === "failed"
  ) {
    return status;
  }

  return "pending";
}

async function getData(): Promise<Payment[]> {
   const token = await getAuthToken();
    if (!token) {
       redirect("/sign-in");
    }

    const postAuthRedirect = await fetchQuery(api.users.getPostAuthRedirect, {}, { token });
    if (!postAuthRedirect?.isAdmin) {
      redirect(postAuthRedirect?.redirectTo ?? "/settings");
    }

    const sales = await fetchQuery(api.sales.getAllSales,{},{token});

  return sales.map((sale) => ({
    customImage: sale.customerLogo ?? "",
    status: toPaymentStatus(sale.status),
    productName: sale.productName ?? "",
    customerName: sale.customerName ?? "",
    customerLogo: sale.customerLogo ?? "",
    customerEmail: sale.customerEmail ?? "",
    date: sale.date,
    price: sale.price,
  }));
}

export default async function Sales(){
    const sales = await getData();

    return (
    <ContentLayout title="Sales" description="View all sales for your online store" >
        <div>
        <SalesTable columns={columns} data={sales}    />
        </div>
    </ContentLayout>)

}
