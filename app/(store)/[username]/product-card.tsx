import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import { formatPrice } from "@/lib/formatPrice"
import Link from "next/link"

type Props={product:Doc<'products'>, store:Doc<'users'>,}
export function ProductCard({product,store}:Props){
    return (<><Card>
  <CardHeader>
    <CardTitle className="flex justify-between"><span>{product.name}</span>
    <span className="text-lg">{formatPrice({price:product.price})}</span>
    
    </CardTitle>
    <CardDescription>{product.description}</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    {product.coverImage?(<img src={product.coverImage} className="border mb-6 h-40 w*full object-cover rounded-md"/>):<div 
    className="rounded-md"></div>}
    <Button asChild size="sm" className="w-full">
        <Link href={`/${store.username}/${product._id}`}>View Product</Link>
    </Button>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card></>)
}