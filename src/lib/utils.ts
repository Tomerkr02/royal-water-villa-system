import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDisplayTime(date: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
