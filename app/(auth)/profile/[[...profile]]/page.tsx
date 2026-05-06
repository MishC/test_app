import { UserProfile } from "@clerk/nextjs"

export const metadata = {
    title: "Profile",
    description: "This is the profile page."
}

export default function Page() {
    return (
        <UserProfile path="/profile" />
    )
}