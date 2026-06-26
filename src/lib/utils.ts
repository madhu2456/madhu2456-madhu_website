import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMonthYear(value?: string) {
  if (!value) return "Present";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function normalizeCompanyName(company: string) {
  if (/redbus/i.test(company)) return "redBus";
  if (/groupm/i.test(company)) return "GroupM (WPP)";
  return company.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

export function formatPeriod(
  startDate: string,
  endDate?: string,
  current?: boolean,
) {
  const start = formatMonthYear(startDate);
  const end = current ? "Present" : formatMonthYear(endDate);
  return `${start} to ${end}`;
}
