import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";


export function useUploadFile() {
    const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
    const getFileUrl = useMutation(api.storage.getFileUrl);

    //local function to handle the file upload process
    const uploadFile = async (file: File) => {
        try {
            // Step 1: Generate an upload URL
            const uploadUrl = await generateUploadUrl();

            // Step 2: Upload the file to the generated URL
            const result=await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });
            const {storageId} = await result.json();
            // Step 3: Get the public URL of the uploaded file
            const fileUrl = await getFileUrl({ storageId });
            return fileUrl;
        }
        catch (error) {
            console.error("File upload error:", error);
            throw new Error("Failed to upload file");
        }
    };

    return  uploadFile ;
}