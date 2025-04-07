"use client";

import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-4/5 mx-auto mt-7">
     
     <nav>
      hello 
      
     </nav>

      <Toaster />
      {children}

    
    </div>
  );
}
