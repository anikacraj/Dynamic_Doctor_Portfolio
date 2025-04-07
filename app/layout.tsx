"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}  >
     <div className="w-4/5 mx-auto mt-7">
     
     </div>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
    
      </body>
    </html>
  );
}