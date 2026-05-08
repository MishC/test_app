"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";

const settingsFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  about: z
    .string()
    .max(500, {
      message: "About must be less than 500 characters",
    })
    .optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      username: "",
      name: "",
      about: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: SettingsFormValues) {
    console.log("Settings updated:", values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="about" className="block text-sm font-medium">
          About
        </label>
        <textarea
          id="about"
          rows={5}
          {...register("about")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.about && (
          <p className="text-sm text-red-500">{errors.about.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        Update Settings
      </button>
    </form>
  );
}