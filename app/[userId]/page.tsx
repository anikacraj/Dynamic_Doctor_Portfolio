import { Button } from "@/components/ui/button";
import Contact from "@/components/ui/Contact";
import UserPageHeader from "@/components/ui/Header/UserPageHeader";
import PhotoGallery from "@/components/ui/PhotoGallery";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import Social from "@/components/ui/social";
import { dbConnect } from "@/config/dbConnect";
import User from "@/models/user.model";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: { userId: string };
};

// Async function to fetch user data from MongoDB
export default async function ProfilePage({ params }: ProfilePageProps) {
  await dbConnect();
  const user = await User.findById(params.userId);

  // If the user is not found, show 404 page
  // if (!user) {
  //   notFound();
  // }

  return (
 <section className="h-full ">
  <div className="container mx-auto h-full">

<div className="flex flex-col-reverse xl:flex-row items-center justify-around
xl:pt-8 xl:pb-24 xl:mt-15
">
<div className="text-center xl:text-left font-serif" >
<span className="h2">Hello</span>
<h1 className="h1">I'm DR.<br />
<span className="text-blue-400">{user.name}</span>
</h1>
<h3 className="max-w-[500px] mb-5 text/80">Spealized Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, placeat.</h3>

<div className="flex flex-col xl:flex-row items-center gap-8">
<Link href='#contact' className="uppercase rounded-lg flex items-center gap-2 border-1 border-amber-500 p-4

">
<span className="hover:bg-amber-800-300 transition-all duration-300 font-serif scroll-auto">Let's Connect With Me </span>
</Link>
<div className="mt-[-30px] ">
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
 <Contact  />
 </div>
 </section>
  );
}
