import {z} from "zod";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel,FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    }, mode: "onChange",
 });
    return (
        <div className="product-form">
            <h1>New Product</h1>
            <form action="">
 <Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Name</FieldLabel>

      <Input
        {...field}
        id={field.name}
        placeholder={"Product name"}
        autoComplete="off"
        aria-invalid={fieldState.invalid}
      />

      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}    
/>


            </form>
        </div>
    )
}