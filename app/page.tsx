"use client";

import { useSession } from "next-auth/react";
import Loading from "./loading";

import Drawer from "@/components/ui/Drawer";

import Image from "next/image";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header/HomePageHeader";
import DesktopSlider from "@/components/ui/DesktopSlider";
import MobileSlider from "@/components/ui/MobileSlider";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header */}
     
<Header />
      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center px-4 py-12 gap-8">
        {/* Text */}
        <div className="text-center sm:text-left">
          {session?.user ? (
            <h1 className="text-4xl sm:text-5xl font-bold">
              Welcome,{" "}
              <span className="text-blue-300 text-5xl sm:text-6xl">
                {session.user.name}
              </span>
            </h1>
          ) : (
            <>
              <h1 className="text-3xl sm:text-6xl font-bold cursor-pointer hover:text-blue-400 transition duration-300">
                Welcome to 🩺DR <span className="text-blue-300">Port.</span>
              </h1>
              <p className="mt-4 text-white text-xl sm:text-4xl font-extrabold font-serif">
                You're viewing as a guest. Please sign in to see your profile.
              </p>
            </>
          )}
        </div>

        {/* Image */}
        <div className="relative shadow-xl ring-1 ring-gray-200 rounded-xl w-[280px] h-[280px] sm:w-[470px] sm:h-[400px]">
          <Image
            src="/contactDr.png"
            priority
            quality={100}
            alt="dr photo"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </section>

      {/* Sliders */}
      <section className="flex justify-center items-center my-8 flex-col gap-6">
       <DesktopSlider />
       <MobileSlider />
      </section>

      {/* Footer */}
   
    </div>
  );
}
