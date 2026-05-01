import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  },
) {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", options);
  } catch {
    return dateString;
  }
}

export function isDateExpired(dateString: string | null | undefined) {
  if (!dateString) return false;
  try {
    return new Date(dateString) < new Date();
  } catch {
    return false;
  }
}
