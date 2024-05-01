import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
 return twMerge(clsx(inputs));
}

export const copyToClipboard = (text, item = "text") => {
 navigator.clipboard
  .writeText(text)
  .then(() => {
   console.log("Text copied to clipboard");
   toast.success(`${item} copied to clipboard`);
  })
  .catch((error) => {
   console.error("Failed to copy text to clipboard:", error);
  });
};
