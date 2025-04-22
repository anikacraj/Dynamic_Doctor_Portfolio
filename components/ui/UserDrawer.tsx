'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function UserDrawer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <>
      {/* Toggle Button */}
      <button onClick={toggleMenu} className="p-2  text-2xl md:hidden">
        ☰
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99]"
          onClick={toggleMenu}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-black dark:text-white text-black transform transition-transform duration-300 z-[100] p-6 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={toggleMenu}>❌</button>
        </div>

        <ul className="flex flex-col gap-3">
  {session?.user ? (
    <li>
      <button
        onClick={() => {
          signOut();
          toggleMenu();
        }}
        className="block w-full text-left px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
      >
        Sign Out
      </button>
    </li>
  ) : (
    <li>
      <Link
        href="/login"
        onClick={toggleMenu}
        className="block px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200"
      >
        Sign In
      </Link>
    </li>
  )}

  <li>
    <Link
      href={session?.user ? `/${session.user.id}` : '/register'}
      onClick={toggleMenu}
      className="block px-4 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200"
    >
      {session?.user ? 'Your Profile' : 'Register'}
    </Link>
  </li>

  {session?.user && (
    <li>
      <Link
        href={`/${session.user.id}/editProfile`}
        onClick={toggleMenu}
        className="block px-4 py-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all duration-200"
      >
        Edit Profile
      </Link>
    </li>
  )}

  <li>
    <Link
      href="/demo"
      onClick={toggleMenu}
      className="block px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-200"
    >
      Demo Profile
    </Link>
  </li>
</ul>

      </div>
    </>
  );
}
