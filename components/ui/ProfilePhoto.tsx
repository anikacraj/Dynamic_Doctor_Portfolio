"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ProfilePhoto = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
      initial={{opacity:0}}
      animate={{
        opacity: 1, 
        transition:{delay:0.25, duration:1, ease:"easeIn"}
      }}
      >
        <motion.div
         initial={{opacity:0}}
         animate={{
           opacity: 1, 
           transition:{delay:0.5, duration:1, ease:"easeInOut"}
         }}
        className="relative w-[298px] h-[298px] xl:w-[500px] xl:h-[500px] rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
          <Image 
            src="/Drprofile.png" // ✅ make sure this file is in /public
            priority
            quality={100}
            alt="dr photo"
            fill
            className="object-cover rounded-full"
          />
      </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePhoto;
