'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Drawer from '../Drawer';

export default function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user?.id) return null;

  const links = [
    { name: 'Home', path: `/${session.user.id}` },
    { name: 'About Me', path: `/${session.user.id}/about` },
    { name: 'Work', path: `/${session.user.id}/work` },
    { name: 'Contact', path: `/${session.user.id}/chamber` },
  ];

  return (
    <nav className="p-2 md:hidden">
      <Drawer links={links} />
    </nav>
  );
}
