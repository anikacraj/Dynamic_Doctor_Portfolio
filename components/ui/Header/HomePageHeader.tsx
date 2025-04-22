// components/Header.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import UserDrawer from "../UserDrawer";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // Set user from session
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
    {/* Header Wrapper */}
    <header className="w-full py-6 xl:py-8 mt-10 mb-10 px-4 text-accent bg-white dark:bg-black">
      <div className="max-w-[1200px] mx-auto flex justify-around items-center">
        
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl sm:text-4xl font-bold cursor-pointer hover:text-blue-400 transition duration-300">
            🩺DR <span className="text-blue-300">Port.</span>
          </h1>
        </Link>
  
        {/* Desktop Navigation */}
        <ul className="hidden xl:flex gap-8 items-center text-xl font-semibold ml-auto">
          <li className="hover:text-blue-400 transition   hover:underline underline-offset-4">
            {session?.user ? (
              <button onClick={() => signOut()} className="text-red-600">
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
            )}
          </li>
          <li className="hover:text-blue-700  transition hover:underline underline-offset-4 ">
            {session?.user ? (
              <Link href={`/${session.user.id}`}>My Profile</Link>
            ) : (
              <Link href="/register">Register</Link>
            )}
          </li>
          {session?.user && (
            <li className="hover:text-blue-700  transition hover:underline underline-offset-4 ">
              <Link href={`/${session.user.id}/editProfile`}>Edit Profile</Link>
            </li>
          )}
          <li className="hover:text-blue-700  transition hover:underline underline-offset-4 ">
            <Link href="/demo">Demo Profile</Link>
          </li>
        </ul>
  
        {/* Mobile Menu Icon */}
        <nav className="xl:hidden ml-4">
          <UserDrawer />
        </nav>
      </div>
    </header>
  </>
  
  );
}
