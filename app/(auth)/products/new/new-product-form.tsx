"use client";

import { api
 } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import toast from "react-hot-toast";
import { z } from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/lib/useUplodFile";

const productSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number",
  }),
  description: z.string(),
  coverImage: z.string(),
  content: z.string(),
  published: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;
//
export function ProductForm() {
  const uploadFile = useUploadFile();
  const createProduct = useMutation(api.products.createProduct) 
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      coverImage: "",
      content: "",
      published: true,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (values:ProductFormValues) => {
    await createProduct({...values});
    toast.success("Product created");
  };
  return (
    <div className="w-full max-w-6xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          name="coverImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Cover Image</FieldLabel>

              <Input
                id={field.name}
                type="file"
                accept="image/*"
                onChange={async (event) => {
                    const file = event.currentTarget.files?.[0];

                    if (!file) return;  
                  const fileUrl = await uploadFile(file);

                  field.onChange(fileUrl);
                }}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

              {field.value && (
                <div className="mt-4 grid overflow-hidden rounded-md border border-dashed md:grid-cols-[220px_1fr]">
                  <div className="flex h-44 items-center justify-center overflow-hidden bg-muted">
                    <img
                      src={field.value}
                      alt="Cover preview"
                      className="w-full h-36 object-cover border border-dashed rounded-md"
                    />
                  </div>
                  <div className="p-4">
                    <Field>
                      <FieldLabel> Name</FieldLabel>
                      <Input type="text" value={field.value} readOnly/>
                    </Field>

                    <Field data-invalid={!!form.formState.errors.content}>
                      <FieldLabel htmlFor="content">
                        About{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FieldLabel>

                      <Textarea
                        id="content"
                        placeholder="Short description about the image"
                        className="min-h-16"
                        {...form.register("content")}
                      />

                      {form.formState.errors.content && (
                        <FieldError errors={[form.formState.errors.content]} />
                      )}
                    </Field>
                  </div>
                </div>
              )}
            </Field>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>

            <Input
              id="name"
              placeholder="Product name"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <FieldError errors={[form.formState.errors.name]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel htmlFor="price">
              Price <span className="text-destructive">*</span>
            </FieldLabel>

            <div className="flex rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
              <div className="flex items-center border-r px-3 text-muted-foreground">
                $
              </div>

              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="border-0 focus-visible:ring-0"
                {...form.register("price", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {form.formState.errors.price && (
              <FieldError errors={[form.formState.errors.price]} />
            )}
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>

          <Textarea
            id="description"
            placeholder="Enter product description..."
            className="min-h-32"
            {...form.register("description")}
          />

          {form.formState.errors.description && (
            <FieldError errors={[form.formState.errors.description]} />
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.published}>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 size-4"
              {...form.register("published")}
            />

            <span>
              <span className="block font-medium">Publish product</span>
              <span className="block text-sm text-muted-foreground">
                Make product available for purchase
              </span>
            </span>
          </label>

          {form.formState.errors.published && (
            <FieldError errors={[form.formState.errors.published]} />
          )}
        </Field>

        <Button type="submit">Create product</Button>
      </form>
    </div>
  );
}
