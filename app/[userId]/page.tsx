import { Button } from "@/components/ui/button";
import Contact from "@/components/ui/Contact";
import PhotoGallery from "@/components/ui/PhotoGallery";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import Social from "@/components/ui/social";
import { dbConnect } from "@/config/dbConnect";
import Link from "next/link";
import { notFound } from "next/navigation";
import userModel from "@/models/user.model";

// 👇 Accept `params` to get the dynamic ID from the route
export default async function ProfilePage({ params }: { params: { userId: string } }) {
  await dbConnect();

  // ✅ Now fetch by dynamic userId
  const user = await userModel.findById(params.userId);

  if (!user) {
    return notFound();
  }

  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col-reverse xl:flex-row items-center justify-around xl:pt-8 xl:pb-24 xl:mt-15">
          <div className="text-center xl:text-left font-serif space-y-4">
            <span className="text-2xl text-gray-500 dark:text-gray-400 tracking-wide">Hello & welcome</span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              I'm Dr. <br />
              <span className="text-blue-500 dark:text-accent">{user.name}</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-blue-400 pl-4 italic">
              Passionate about healing and driven by compassion, I specialize in{" "}
              <span className="font-semibold text-blue-600 dark:text-accent">
                {user.specialization || "patient-centered care"}
              </span>. With years of experience, I’m dedicated to improving lives through precise diagnosis and personalized treatment.
            </p>

            <div className="flex flex-col xl:flex-row items-center gap-8 mt-3">
            <Link
        href="#contact"
        scroll={true}
        className="uppercase rounded-lg flex items-center gap-2 border border-amber-500 px-5 py-3 transition-all duration-300 bg-gradient-to-r from-amber-900 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-500
         hover:text-black font-serif shadow-md"
      >
        Let's Connect With Me
      </Link>
              <div className="mt-[-30px]">
                <Social />
              </div>
            </div>
          </div>

          <div>
            <ProfilePhoto />
          </div>
        </div>
        <PhotoGallery />
      </div>

      <hr />

      <div id="contact">
        <Contact />
      </div>
    </section>
  );
}
