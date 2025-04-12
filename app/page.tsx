"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./loading";
import Header from "@/components/ui/Header/HomePageHeader";
import Drawer from "@/components/ui/Drawer";

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!user) {
    return <p>User not logged in</p>;
  }

  return (
   <div className="h-screen w-4/6 ">
   <div>
   <Header />
   </div>

     <div className="flex justify-center items-center h-screen">
      
      <div className="w-full max-w-md">
        <h1 className="text-2xl">Welcome, {user.name}</h1>
        <p className="bold text-5xl">Email: {user.email}</p>
        <p>User ID: {user.id}</p>
      </div>
    </div>
   </div>
  );
}
