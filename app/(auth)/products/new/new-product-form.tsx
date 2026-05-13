"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Controller, createFormControl } from "react-hook-form";
import {SubmitHandler} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  const router=useRouter();
  const form = useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      coverImage: "",
      content: "",
      published: false,
    },
    mode: "onChange",
  });

 const onSubmit: SubmitHandler<SettingsKeyFormValues> = async (values, event) => {
  event?.stopPropagation();

 

  toast.success("Stripe secret key saved successfully");
  router.refresh();
};
  return (
    <div className="product-form">
      <h1>New Product</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </div>
  );
}
