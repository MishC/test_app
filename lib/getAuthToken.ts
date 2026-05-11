import { auth } from "@clerk/nextjs/server";

export async function getAuthToken(): Promise<string | null> {
    return (await auth()).getToken({ template: 'convex' }) ?? undefined;
}