import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hairstylist - Your Personal Hairstylist",
  description: "Professional hairstyling education and community platform",
  keywords: ["hairstyling", "beauty", "education", "tutorials", "workshops"],
  authors: [{ name: "Hairstylist Team" }],
  creator: "Hairstylist",
  publisher: "Hairstylist",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Hairstylist - Your Personal Hairstylist",
    description: "Professional hairstyling education and community platform",
    siteName: "Hairstylist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hairstylist - Your Personal Hairstylist",
    description: "Professional hairstyling education and community platform",
    creator: "@hairstylist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
