import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAdminToken() {
  return typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
}
