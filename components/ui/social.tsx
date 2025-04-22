import Link from 'next/link';
import path from 'path';

import {FaFacebook ,FaGithub,FaLinkedinIn,FaYoutube ,FaTwitter } from "react-icons/fa";

const socials =[
    {icon:<FaFacebook />,path:""},
    {icon:<FaLinkedinIn />,path:""},
    {icon:<FaYoutube />,path:""},
    {icon:<FaTwitter/>,path:""},
]

 const Social=() =>{
  return (
    <div className='flex flex-row gap-4 text-3xl mt-[-20px] xl:mt-[30px]'>
        {
            socials.map((item,index)=>{
                return (
                    <Link key={index} href={item.path} className="group mt-8 sm:mt-2">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1f1f1f] hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400 shadow-md transition-all duration-300">
                      {item.icon}
                    </span>
                  </Link>
                  
                )
            })
        }

    </div>
  )
}

export default Social