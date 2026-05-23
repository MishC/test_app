import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";

type Props={
    product:Doc<'products'>
}
export function BuyButton({product}:Props){
    return(
       <Button>Buy now</Button>
       
    )
}