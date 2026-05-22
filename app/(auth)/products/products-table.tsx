import { Badge } from "@/components/ui/badge";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import DeleteProductDialog from "./delete-product-dialog";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/formatPrice";
import { CustomImage } from "@/components/ui/custom-image";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export type ProductWithStats = Doc<"products"> & {
  sales: number;
  revenue: number;
  user: Doc<"users"> | null;
};

export type Props = {
  products: ProductWithStats[];
};

export default async function ProductTable({ products }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-25 sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead className="hidden md:table-cell">Revenue</TableHead>

          <TableHead className="hidden md:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>

          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.map((product) => (
            <TableRow key={product?._id}>
              <TableCell className="hidden w-25 sm:table-cell">
                <CustomImage src={product.coverImage} alt={product.name} />
              </TableCell>
              <TableCell className="font-medium">
                <div>{product?.name}</div>
                {/*            {product.user && (
  <Link href={`/${product.user.username}/${product._id}`} target="_blank">
    <span className="text-xs underline">Preview</span>
  </Link>
)} */}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {product.sales}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPrice({ price: product.revenue })}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {formatPrice({ price: product.price })}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={product.published ? "default" : "outline"}>
                  {product.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/products/edit/${product._id}`}>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DeleteProductDialog product={product}/>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
