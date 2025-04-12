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
                    <Link key={index} href={item.path}  >
                     <span className="border-white-1 p-4 rounded-full hover:text-blue-600 transition-all duration-300">
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