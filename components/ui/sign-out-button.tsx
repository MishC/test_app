'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = (logout:string) => {
  const { signOut } = useClerk()

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <button onClick={() => signOut({ redirectUrl: '/' })}>{logout}</button>
  )
}