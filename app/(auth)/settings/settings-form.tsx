"use client"; // This file is a client component because it uses React hooks and form state.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { ConvexError } from "convex/values";
import SettingsLogo from "./settings-logo";
import { SettingsKey } from "./settings-key";
import { useConvexAuth } from "convex/react"; //read clerk.md
import { useState } from "react";

//Data input error handling
const settingsFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .regex(/^\S+$/, {
      message: "Username cannot contain spaces",
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
type Props = {
  user: Doc<"users">;
};

type stripeSecretKey = Doc<"keys">;

export function SettingsForm({ user }: Props) {
  
  //state
  const [isOpen, setOpen] = useState(false);
  
  const updateUser = useMutation(api.users.updateUser);
  const { isAuthenticated } = useConvexAuth();



  const stripeSecretKey = useQuery(
    api.keys.getStripeSecretKey,
    isAuthenticated ? {} : "skip",
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema), //const form = useForm();
    defaultValues: {
      username: user.username ?? "",
      name: user.name ?? "",
      about: user.about ?? "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: SettingsFormValues) {
    try {
      await updateUser({
        username: values.username,
        about: values.about,
        name: values.name,
        userId: user._id,
      });

      toast.success("Settings updated");
    } catch (error) {
      const message = error instanceof ConvexError ? error.data : "";
      console.log(message);
      if (message === "USERNAME_TAKEN") {
        setError("username", {
          type: "manual",
          message: "Username already taken. Please choose another one.",
        });
      } else {
        toast.error("Failed to update settings");
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl mb-10"
      >
      

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
        <SettingsLogo user={user} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          Update Settings
        </button>
      </form>
      <SettingsKey stripeSecretKey={stripeSecretKey} isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
