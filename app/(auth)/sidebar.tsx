import {Package2 } from "lucide-react";
import Link from "next/link";
export function Sidebar() {
    return (
        <div className="flex flex-col justify-between h-full gap-4 py-2" >
            <div className="flex h-14 mb-4 items-center border-b px-4 gap-2">
                <Link href="/" className="flex items-center gap-4 font-semibold"><Package2  className="size-6"/></Link>
                <span>Next Store</span></div>
        
        </div>
    )
}