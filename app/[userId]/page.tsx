import UserPageHeader from "@/components/ui/Header/UserPageHeader";
import { dbConnect } from "@/config/dbConnect";
import User from "@/models/user.model";
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
   <div>
    <div>
     
    </div>
     <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl">Profile of {user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phoneNo}</p>
      </div>
    </div>
   </div>
  );
}
