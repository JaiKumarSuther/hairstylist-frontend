import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cookie utilities for authentication
export const cookieUtils = {
  set: (name: string, value: string, days: number = 7) => {
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
    }
  },
  
  get: (name: string): string | null => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
      return cookie ? cookie.split('=')[1] : null;
    }
    return null;
  },
  
  remove: (name: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};
