"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export default function Nav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user?.id) return null // or show loading spinner
  const links = [
    {

      name: "Home",
      path: `/${session.user.id}`,
    },
    {
      name: "About Me",
      path: `/${session.user.id}/about`,
    },
    {
      name: "Work",
      path: `/${session.user.id}/work`,
    },
    {
      name: "Chamber",
      path: `/${session.user.id}/chamber`,
    },
  ]

  return (
    <nav className="flex gap-8">
    {links.map((link, index) => (
      <Link
        href={link.path}
        key={index}
        className={cn(
          "capitalize text-lg md:text-xl font-medium transition-all duration-300",
          "hover:text-blue-600 dark:hover:text-blue-300", // hover effect
         
          link.path === pathname
            ? "text-blue-700 dark:text-blue-400 border-b-3 border-blue-700 dark:border-blue-400"
            : "text-gray-700 dark:text-gray-300"
            
        )}
      >
        {link.name}
      </Link>
    ))}
  </nav>
  )
}
