"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Controller, createFormControl } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useUploadFile } from "@/lib/useUplodFile";

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
  const router = useRouter();
  const form = useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
    
      coverImage: "",
      published: false,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<NewProductFormValues> = async (
    values,
    event,
  ) => {
    event?.stopPropagation();

    toast.success("Product created successfully");
    router.refresh();
  };

  const uploadFile= useUploadFile();
  return (
    <div className="product-form">
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <Controller
          name="coverImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Cover Image</FieldLabel>

              <Input
                type="file"
                id={field.name}
                accept="image/*"
                onChange={(e) => {uploadFile(e.target.files?.[0]!).then((url) => {
                  field.onChange(url);
                })  }}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />} 
              {field.value && <img src={field.value} alt="Cover Image" className="w-28 h-28 object-cover rounded-md" />}
            </Field>
          )}
        />
       
      </form>
    </div>
  );
}
