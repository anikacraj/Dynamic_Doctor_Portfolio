// components/Header.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";

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
      <div className="py-13 xl:py-12 text-accent px-4 w-3/4">
        <div className="w-full mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="sm:ml-30">
            <h1 className="sm:text-4xl text-3xl font-bold cursor-pointer hover:text-blue-400 transition duration-300">
              🩺DR <span className="text-blue-300">Port.</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex gap-8 items-center text-2xl  font-semibold sm:mr-[-400px] list-none">
            <li className="hover:text-blue-400 transition">
              {session?.user ? (
                <button onClick={() => signOut()} className="text-red-600 ">
                  Sign Out
                </button>
              ) : (
                <Link href="/login" className="hover:underline">
                  Sign In
                </Link>
              )}
            </li>
            <li className="hover:text-blue-400 transition">
              {session?.user ? (
                <Link href={`/${session.user.id}`} >
                  My Profile
                </Link>
              ) : (
                <Link href="/register" >
                  Register
                </Link>
              )}
            </li>
            {session?.user && (
              <li className="hover:text-blue-400 transition">
                <Link href={`/${session.user.id}/editProfile`} >
                  Edit Profile
                </Link>
              </li>
            )}
            <li className="hover:text-blue-400 transition">
              <Link href="/demo">Demo Profile</Link>
            </li>
          </ul>

          {/* Mobile Menu Icon */}
          <div
            className={`xl:hidden text-3xl cursor-pointer z-[101] transition-all duration-300 ${
              menuOpen ? "mr-0" : "-mr-[100px]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes className="top-0 text-red-600" /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`xl:hidden fixed top-0 right-0 h-full w-[30vh] bg-white text-black transform transition-transform duration-300 z-[100] p-6 ${
          menuOpen ? "translate-x-0 right-25" : "translate-x-full "
        }`}
      >
        <ul className="flex mt-10 text-left flex-col items-start text-base font-medium space-y-6 ">
          <li className="hover:text-blue-400 transition text-xl font-serif font-semibold ">
            {session?.user ? (
              <button onClick={() => signOut()} className="text-red-600 hover:underline ">
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
            )}
          </li>
          <li className="hover:text-blue-400 transition text-xl font-serif font-semibold ">
            {session?.user ? (
              <Link href={`/${session.user.id}`} className="hover:underline">
                Your Profile
              </Link>
            ) : (
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            )}
          </li>
          {session?.user && (
            <li className="hover:text-blue-400 transition text-xl font-serif font-semibold ">
              <Link href={`/${session.user.id}/editProfile`} className="hover:underline">
                Edit Profile
              </Link>
            </li>
          )}
          <li className="hover:text-blue-400 transition text-xl font-serif font-semibold ">
            <Link href="/demo">Demo Profile</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
