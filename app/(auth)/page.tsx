import Link from "next/link";
import { ContentLayout } from "./content-layout";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { DashboardCard } from "./dashboard-card";
import { DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const token=await getAuthToken();
  if (!token){
    return ""
  }
  const sales= await fetchQuery(api.sales.getDashboardStats,{},{ token });
    return (
       <ContentLayout title="Dashboard" description="View all your recent sales and analytics" >
<div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-8 gap-4 mb-4 ">
  <DashboardCard label="Total Revenue" value={stats.totalRevenue} icon={<DollarSign className="size-5 text-muted-foreground"/>}/>
</div>
       </ContentLayout>
    )
  }