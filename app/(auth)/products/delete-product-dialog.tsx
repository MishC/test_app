import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"

type Props={
    product:Doc<"products">;

}

export default function DeleteProductDialog({product}:Props){
    const deleteProduct=useMutation(api.products.deleteProduct);
    const router=useRouter();
return (
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this product. This action cannot be undone. 
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={async ()=>{ await deleteProduct({productId:product._id});router.refresh();
      toast("Product deleted",{ position: "bottom-right"})}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>

)
}