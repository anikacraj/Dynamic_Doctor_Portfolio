"use client";

import { useSession } from "next-auth/react";
import Loading from "./loading";
import Header from "@/components/ui/Header/HomePageHeader";
import Drawer from "@/components/ui/Drawer";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="h-screen w-4/6 ">
      <div>
        <Header />
      </div>

      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          {session?.user ? (
            <>
              <h1 className="text-2xl">Welcome, {session.user.name}</h1>
              <p className="bold text-5xl">Email: {session.user.email}</p>
              <p>User ID: {session.user.id}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">Welcome to Dr Port 👋</h1>
              <p className="mt-4 text-gray-600">You're viewing as a guest. Please sign in to see your profile.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
