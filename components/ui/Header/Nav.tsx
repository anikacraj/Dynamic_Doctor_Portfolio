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
      name: "Contact",
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
    "capitalize font-lg text-xl hover:text-blue-200 transition-normal",
    link.path === pathname && "text-accent border-b-2 border-accent"
  )}
>
  {link.name}
</Link>

      ))}
    </nav>
  )
}
