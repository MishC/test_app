import React from 'react';

export default function ClerkLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex items-center justify-center pt-20 sm:pt-24" >
      {children}
     </div>
  )
}