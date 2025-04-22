import { Button } from "@/components/ui/button";
import Contact from "@/components/ui/Contact";
import PhotoGallery from "@/components/ui/PhotoGallery";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import Social from "@/components/ui/social";
import { dbConnect } from "@/config/dbConnect";
import Link from "next/link";
import { notFound } from "next/navigation";
import userModel from "@/models/user.model";

export default async function ProfilePage() {
  await dbConnect();
  
  // Fetch the first user (for demonstration)
  // In a real app, you'd fetch the logged-in user's data
  const user = await userModel.findOne().select('name');
  
  if (!user) {
    return notFound();
  }

  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col-reverse xl:flex-row items-center justify-around xl:pt-8 xl:pb-24 xl:mt-15">


          <div className="text-center xl:text-left font-serif">
           <div className="text-center xl:text-left font-serif space-y-4">
  {/* Greeting */}
  <span className="text-2xl text-gray-500 dark:text-gray-400 tracking-wide">Hello & welcome</span>

  {/* Name Introduction */}
  <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
    I'm Dr. <br />
    <span className="text-blue-500 dark:text-accent">{user.name}</span>
  </h1>

  {/* Professionally Styled Bio */}
  <p className="max-w-xl text-lg  leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-blue-400 pl-4 italic">
    Passionate about healing and driven by compassion, I specialize in <span className="font-semibold text-blue-600 dark:text-accent">{user.specialization || "patient-centered care"}</span>. With years of experience, I’m dedicated to improving lives through precise diagnosis and personalized treatment.
  </p>
</div>



            <div className="flex flex-col xl:flex-row items-center gap-8 mt-3">
              <Link
                href="#contact"
                className="uppercase rounded-lg flex items-center gap-2 border-1 border-amber-500 p-4"
              >
                <span className="hover:bg-amber-800-300 transition-all duration-300 font-serif scroll-auto">
                  Let's Connect With Me
                </span>
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