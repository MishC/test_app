import { cn } from "@/lib/utils";
type Props={
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    size?: "small" | "medium" | "large";

}

export function CustomImage({ src, alt, width, height,size }: Props) {
    return (
        <img src={src||`https://avatar.vercel.sh/${alt?.replace(' ', '_') || 'default'}`}
         alt={alt} width={width} height={height}
          className={cn("shadow-sm border border-black/10 rounded-medium",
          size==="small" && "size-10",
          size==="medium" && "size-20",
          size==="large" && "size-40"
          )} />
    )
}