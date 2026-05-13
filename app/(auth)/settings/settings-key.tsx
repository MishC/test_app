"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"


import { CheckIcon, KeyIcon } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

type Props = {
  stripeSecretKey: Doc<"keys"> | undefined | null;
};

const settingsKeySchema = z.object({
  stripeKey: z
    .string()
    .min(32, {
      message: "Stripe secret key must be at least 32 characters long",
    }),
});

type SettingsKeyFormValues = z.infer<typeof settingsKeySchema>;

export function SettingsKey({ stripeSecretKey }: Props) {
  const form = useForm<SettingsKeyFormValues>({
    resolver: zodResolver(settingsKeySchema),
    defaultValues: {
      stripeKey: stripeSecretKey?.stripeKey ?? "",
    },
    mode: "onChange",
  });

  function onSubmit(values: SettingsKeyFormValues) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {stripeSecretKey ? (
            <CheckIcon className="size-4 mr-2" />
          ) : (
            <KeyIcon className="size-4 mr-2" />
          )}
          Stripe Secret Key
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Secret Key</DialogTitle>

          <DialogDescription>
            Add your Stripe secret here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

      <Controller
  name="stripeKey"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Key</FieldLabel>

      <Input
        {...field}
        id={field.name}
        placeholder={stripeSecretKey ? "Update your Stripe secret key" : "Enter your Stripe secret key"}
        autoComplete="off"
        aria-invalid={fieldState.invalid}
      />

      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}
/>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                Save changes
              </Button>
            </DialogFooter>
   </DialogContent>
    </Dialog>
  );
}