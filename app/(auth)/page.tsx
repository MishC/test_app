import { ContentLayout } from "./content-layout";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { DashboardCard } from "./dashboard-card";
import { Barcode, CreditCard, DollarSign } from "lucide-react";
import { DashboardSales } from "../dashboard-sales";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const token=await getAuthToken();
  if (!token){
    redirect("/sign-in");
  }
  const postAuthRedirect = await fetchQuery(api.users.getPostAuthRedirect, {}, { token });
  if (!postAuthRedirect) {
    const clerkUser = await currentUser();
    const ensuredUser = await fetchMutation(
      api.users.ensureCurrentUser,
      {
        name: clerkUser?.fullName ?? undefined,
        email: clerkUser?.primaryEmailAddress?.emailAddress ?? undefined,
        username: clerkUser?.username ?? undefined,
        about: "",
        logo: clerkUser?.imageUrl ?? undefined,
      },
      { token },
    );

    if (ensuredUser.redirectTo !== "/") {
      redirect(ensuredUser.redirectTo);
    }
  }
  if (postAuthRedirect?.redirectTo && postAuthRedirect.redirectTo !== "/") {
    redirect(postAuthRedirect.redirectTo);
  }

  const { stats, sales } = await fetchQuery(api.sales.getDashboardData, {}, { token });
    return (
       <ContentLayout title="Dashboard" description="View all your recent sales and analytics" >
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <DashboardCard label="Total Revenue" value={stats.totalRevenue} icon={<DollarSign className="size-5 text-muted-foreground" />} />
          <DashboardCard label="Sales" value={stats.totalSales} icon={<CreditCard className="size-5 text-muted-foreground" />} />
          <DashboardCard label="Products" value={stats.totalProducts} icon={<Barcode className="size-5 text-muted-foreground" />} />
          <DashboardSales sales={sales} />
        </div>
       </ContentLayout>
    )
  }
