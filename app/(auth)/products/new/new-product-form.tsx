"use client";

import { z } from "zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),

  description: z.string().optional(),

  price: z.coerce.number().min(0, {
    message: "Price must be positive",
  }),

  coverImage: z.string().optional(),

  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      description: "",
      price: 0,
      coverImage: "",
      published: false,
    },

    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* name */}
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="name">
          Name
        </FieldLabel>

        <Input
          id="name"
          placeholder="Product name"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <FieldError
            errors={[form.formState.errors.name]}
          />
        )}
      </Field>

      {/* description */}
      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="description">
          Description
        </FieldLabel>

        <Textarea
          id="description"
          placeholder="Description"
          {...form.register("description")}
        />

        {form.formState.errors.description && (
          <FieldError
            errors={[form.formState.errors.description]}
          />
        )}
      </Field>

      {/* price */}
      <Field data-invalid={!!form.formState.errors.price}>
        <FieldLabel htmlFor="price">
          Price
        </FieldLabel>

        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...form.register("price", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.price && (
          <FieldError
            errors={[form.formState.errors.price]}
          />
        )}
      </Field>

      {/* published */}
      <Field data-invalid={!!form.formState.errors.published}>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register("published")}
          />

          Published
        </label>

        {form.formState.errors.published && (
          <FieldError
            errors={[form.formState.errors.published]}
          />
        )}
      </Field>

      {/* cover image */}
      <Controller
        name="coverImage"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Cover image
            </FieldLabel>

            <Input
              type="file"
              id={field.name}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                field.onChange(file.name);
              }}
            />

            {fieldState.invalid && (
              <FieldError
                errors={[fieldState.error]}
              />
            )}

            {field.value && (
              <p className="text-sm">
                {field.value}
              </p>
            )}
          </Field>
        )}
      />

      <Button type="submit">
        Save
      </Button>
    </form>
  );
}