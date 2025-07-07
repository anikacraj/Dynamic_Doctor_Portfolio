"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogleScholar } from "react-icons/fa6";

interface Degree {
  name: string;
  college: string;
  year: string;
}

interface Education {
  year: string;
  examName: string;
  institute: string;
}

interface Experience {
  role: string;
  college: string;
  startingYear: string;
  endingYear: string;
}

interface UserData {
  bio: string;
  aboutPicture: string;
  degrees: Degree[];
  education: Education[];
  experience: Experience[];
}

export default function AboutPage({
  params,
}: {
  params: { userId: string };
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.userId}`);

        if (!res.ok) {
          if (res.status === 404) {
            router.push("/404"); // redirect if user not found
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();

        setUser({
          bio: data.bio || "",
          aboutPicture: data.aboutPicture || "/defaultAbout.jpg",
          degrees: data.degrees || [],
          education: data.education || [],
          experience: data.experience || [],
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.userId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">Loading about page...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">User data not found.</p>
      </div>
    );
  }

  const { bio, aboutPicture, degrees, education, experience } = user;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs.Root
          defaultValue="aboutMe"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          {/* Tabs Trigger List */}
          <Tabs.List className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-4">
            {[
              { label: "About Me", value: "aboutMe" },
              { label: "Research", value: "education" },
              { label: "Degree", value: "degree" },
              { label: "Experience", value: "experience" },
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className="text-left text-xl font-semibold px-4 py-3 rounded-lg transition-all
                  text-gray-700 hover:text-blue-600 
                  data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700
                  dark:text-white dark:hover:text-accent 
                  dark:data-[state=active]:bg-[#232329] dark:data-[state=active]:text-accent"
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tabs Content */}
          <div className="flex-1">
            {/* About Me */}
            <Tabs.Content value="aboutMe">
              <div className="h-[400px] sm:flex flex flex-col sm:flex-row gap-5 bg-[#1f1f23] rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-[#2c2c30] p-6 pr-4">
                <div className="space-y-6 order-2 sm:order-none">
                  <h3 className="text-4xl font-bold text-white">About Me</h3>
                  <p className="max-w-[600px] text-lg text-gray-300 leading-relaxed text-justify">
                    {bio || "This doctor has not added a bio yet."}
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.5, duration: 1, ease: "easeInOut" },
                  }}
                  className="relative w-[300px] min-h-[298px] xl:w-[400px] xl:h-[350px] order-1 sm:order-none overflow-hidden border-4 border-white-500 rounded-2xl shadow-md"
                >
                  <Image
                    src={aboutPicture}
                    alt="About Doctor"
                    priority
                    quality={100}
                    fill
                  />
                </motion.div>
              </div>
            </Tabs.Content>

            {/* Education */}
            <Tabs.Content value="education">
              <div className="h-[400px] bg-[#1f1f23] rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-[#2c2c30] p-6 pr-4">
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {education.map((edu, index) => (
                    <li
                      key={index}
                      className="bg-[#232329] p-6 rounded-xl space-y-2"
                    >
                      <span className="text-accent font-medium">
                        {edu.year}
                      </span>
                      <h4 className="text-xl font-semibold">{edu.examName}</h4>
                      <p className="text-gray-300">{edu.institute}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>

            {/* Degree */}
            <Tabs.Content value="degree">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {degrees.map((deg, index) => (
                  <div
                    key={index}
                    className="bg-[#1f1f23] p-6 rounded-xl text-white space-y-3"
                  >
                    <h4 className="text-2xl font-bold">{deg.name}</h4>
                    <p className="text-lg">{deg.college}</p>
                    <p className="text-accent">Year: {deg.year}</p>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            {/* Experience */}
            <Tabs.Content value="experience">
              <div className="h-[400px] bg-[#1f1f23] rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-[#2c2c30] p-6 pr-4">
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {experience.map((exp, index) => (
                    <li
                      key={index}
                      className="bg-[#232329] p-6 rounded-xl space-y-2"
                    >
                      <span className="text-accent font-medium">
                        {exp.startingYear} - {exp.endingYear}
                      </span>
                      <h4 className="text-xl font-semibold">{exp.role}</h4>
                      <p className="text-gray-300">{exp.college}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </motion.div>
  );
}
