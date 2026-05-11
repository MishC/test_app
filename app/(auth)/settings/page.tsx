import { fetchQuery } from "convex/nextjs"
import { ContentLayout } from "../content-layout"
import { SettingsForm } from "./settings-form"
import { api } from "@/convex/_generated/api"
import { getAuthToken } from "@/lib/getAuthToken"

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
        return <div>User not found</div>;
    }

    return (
        <div>
            <ContentLayout title="Settings" description="Update all of your store information.">
                <SettingsForm user={user} />
            </ContentLayout>
        </div>
    )
}