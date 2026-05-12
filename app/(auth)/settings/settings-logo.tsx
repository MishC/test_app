import { CustomImage } from "@/components/ui/custom-image";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useUploadFile } from "@/lib/useUplodFile";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
type Props = {
  user: Doc<"users">;
};
export default function SettingsLogo({ user }: Props) {
  const uploadFile = useUploadFile();
  const updateUserLogo = useMutation(api.users.updateUserLogo);
  const router = useRouter();

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No image selected");
      return;
    }
    toast.loading("Uploading image...");
    try {
      const logo = await uploadFile(file);
      if (!logo) {
        toast.error("Failed to upload image");
        return;
      }
      await updateUserLogo({ logo, userId: user._id });
      toast.success("Logo updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      toast.dismiss();
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-3 mb-10">
      <CustomImage src={user.logo} size="medium" alt={user.name} />
      <div className="grid w-full max-w-sm items-center gap-1.5 ">
        <Label htmlFor="logo">{""}</Label>
        <Input
          type="file"
          id="logo"
          accept="image/*"
          onChange={onImageUpload}
        />
      </div>
    </div>
  );
}
