import { Button } from "@/components/ui/button";
import Contact from "./Contact";
import ProfilePhoto from "./ProfilePhoto";
import PhotoGallery from "./PhotoGallery";
import Social from "@/components/ui/social";
import { dbConnect } from "@/config/dbConnect";
import Link from "next/link";
import { notFound } from "next/navigation";
import userModel from "@/models/user.model";
import { ShieldCheck } from "lucide-react";
import {FaFacebook ,FaGithub,FaLinkedinIn,FaYoutube ,FaTwitter, FaInstagram } from "react-icons/fa";

// Accept `params` to get the dynamic ID from the route
export default async function ProfilePage({ params }: { params: { userId: string } }) {
  await dbConnect();

  const user = await userModel.findById(params.userId);

  if (!user) {
    return notFound();
  }

  // If user is blocked and still within the block period
  if (user.blocked && user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
    return (
      <div className="text-center text-red-500 mt-10">
        <h1 className="text-2xl font-bold">⚠️ This profile is currently blocked.</h1>
        <p>Access will be restored on {new Date(user.blockedUntil).toLocaleDateString()}</p>
      </div>
    );
  }

  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col-reverse xl:flex-row items-center justify-around xl:pt-8 xl:pb-24 xl:mt-15">
          {/* Left side text */}
          <div className="text-center xl:text-left font-serif space-y-6">
            <span className="text-2xl text-gray-500 dark:text-gray-400 tracking-wide">Hello & welcome</span>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              I'm Dr. <br />
              <span className="text-blue-500 dark:text-accent">
                {user.name}
                {user.adminVerified && (
                  <span className="relative ml-3 group inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-blue-600 shadow-md cursor-pointer">
                    <ShieldCheck className="w-[35px] h-[24px] text-white" />
                    <span className="absolute bottom-full mb-1 hidden group-hover:flex text-xs text-white bg-gray-900 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      Verified Medical Professional
                    </span>
                  </span>
                )}
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-blue-400 pl-4 italic">
              Passionate about healing and driven by compassion, I specialize in{" "}
              <span className="font-semibold text-blue-600 dark:text-accent">
                {user.specialization || "patient-centered care"}
              </span>.{" "}
              {user.bio ||
                "I’m dedicated to improving lives through precise diagnosis and personalized treatment."}
            </p>

            {/* CTA and Socials */}
            <div className="flex flex-col xl:flex-row items-center gap-4 mt-6">
              {/* Call to action button */}
              <Link
                href="#contact"
                scroll={true}
                className="uppercase rounded-full flex items-center gap-2 border border-amber-500 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white hover:from-amber-500 hover:to-yellow-400 hover:text-black font-serif shadow-lg transition-all duration-300"
              >
                Let’s Connect
              </Link>

              {/* Social icons */}
              <div className="flex gap-3 text-2xl">
                {user.fbLink && (
                  <Link
                    href={user.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1f1f1f] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-md">
                      <FaFacebook />
                    </span>
                  </Link>
                )}
                {user.instagram && (
                  <Link
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1f1f1f] hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 shadow-md">
                      <FaInstagram />
                    </span>
                  </Link>
                )}
                {user.linkedin && (
                  <Link
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1f1f1f] hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300 shadow-md">
                      <FaLinkedinIn />
                    </span>
                  </Link>
                )}
                {user.youTubeLink && (
                  <Link
                    href={user.youTubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1f1f1f] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-md">
                      <FaYoutube />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <ProfilePhoto userId={params.userId} />
          </div>
        </div>

        <PhotoGallery userId={params.userId}/>
      </div>

      <hr className="my-8 border-gray-300 dark:border-gray-600" />

      <div id="contact">
        <Contact />
      </div>
    </section>
  );
}

