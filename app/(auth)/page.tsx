import Link from "next/link";
import { ContentLayout } from "./content-layout";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function DashboardPage() {
  const token=await getAuthToken();
  if (!token){
    return ""
  }
  const sales= await fetchQuery(api.sales.getDashboardStats,{},{ token });
  console.log(sales);
    return (
        <div className="DashboardPage">
            <p>This is the dashboard page.</p>
        </div>
    )
  }