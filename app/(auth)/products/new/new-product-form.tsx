import {z} from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";\

const newProductSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    description: z.string().optional(),
    price: z.number().min(0, {
        message: "Price must be a positive number",

    }),
    coverImage: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().default(false),
});

 type NewProductFormValues = z.infer<typeof newProductSchema>;

export function NewProductForm() {
    
 const form=  useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
        name: "",
        description: "",
        price: 0,
        coverImage: "",
        content: "",
        published: false,
    });
    return (
        <div>
            <h1>New Product</h1>
        </div>
    )
}