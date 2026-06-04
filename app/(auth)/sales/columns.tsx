"use client"

import { CustomImage } from "@/components/ui/custom-image"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PaymentStatus = "pending" | "processing" | "success" | "failed"

export type Payment = {
  customImage: string,
  customerLogo: string, 
    customerEmail: string,  
  customerName: string,
    date: string,
  price: number,
  status: PaymentStatus,
  productName: string
}

export const columns: ColumnDef<Payment>[] = [
     {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => { 
      return <div className="flex gap-3 font-medium items-center"><CustomImage src={row.original.customerLogo} 
      width={60} height={60} size="medium" />
      <div className="flex flex-col">
      <span className="font-medium">{row.original.customerName}</span>
            <span className="font-medium">{row.original.customerEmail}</span></div></div>;

    },
    },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let color = "gray";
      if (status === "success") color = "green";
      else if (status === "failed") color = "red";
      else if (status === "processing") color = "yellow";
      else if (status === "pending") color = "blue";
      return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>{row.original.status}</span>;
    },
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <span className="font-medium">${row.original.price.toFixed(2)}</span>;
    },
  },
]
