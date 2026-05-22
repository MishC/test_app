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

type Props={
    product:Doc<"products">;

}

export default function DeleteProductDialog({product}:Props){
    const deleteProduct=useMutation(api.products.deleteProduct);
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
      <AlertDialogAction onClick={async ()=>{ deleteProduct();toast("Product deleted")}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>

)
}