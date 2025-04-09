// components/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <div className="w-4/6 mx-auto mt-7">
      <ul className="flex justify-around items-center">
        <li>
          <Link href="/" className="text-lg font-semibold">LOGO</Link>
        </li>
        <div className="flex gap-5 items-center">
          <li>
            {user ? (
              <button onClick={() => signOut()} className="text-red-600 hover:underline">Sign Out</button>
            ) : (
              <Link href="/login" className="hover:underline">Sign In</Link>
            )}
          </li>
          <li>
            {user ? (
             <Link href={`/${session.user.id}`} className="hover:underline">Your Profile</Link>
            ) : (
              <Link href="/register" className="hover:underline">Register</Link>
            )}
            
          </li>
                
          {user && (
  <li>
  <Link href={`/${session.user.id}/editProfile`} className="hover:underline">
    Edit Profile
  </Link>
</li>
          )}
        </div>
      </ul>
    </div>
  );
}
