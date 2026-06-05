import { fetchMutation, fetchQuery } from "convex/nextjs"
import { ContentLayout } from "../content-layout"
import { SettingsForm } from "./settings-form"
import { api } from "@/convex/_generated/api"
import { getAuthToken } from "@/lib/getAuthToken"
import { Settings } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"

export default async function SettingsPage() {
    const token = await getAuthToken();
    if (!token) {
        return <div>Authentication required. Please sign in to access settings.</div>;
    }

    let user;
    try {
        user = await fetchQuery(api.users.getUser, {}, { token });
    } catch (error) {
        console.error("SettingsPage auth error:", error);
        return <div>Unable to load user. Please sign in again.</div>;
    }

    if (!user) {
        const clerkUser = await currentUser();
        await fetchMutation(
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
        user = await fetchQuery(api.users.getUser, {}, { token });
    }

    if (!user) {
        return <div>Unable to create user profile. Please sign in again.</div>;
    }

    return (
        <div>
           
            <ContentLayout icon={<Settings className="size-6 mt-1"/>}
            title=" Settings" description="Update all of your store information.">
                <SettingsForm user={user} />
            </ContentLayout>
        </div>
    )
}
