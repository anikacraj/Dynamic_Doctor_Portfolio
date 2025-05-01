'use client';
import Link from 'next/link'

import Nav from './Nav'
import { Button } from '../button'
import MobileNav from './MobileNav'


import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function UserPageHeader() {

    const { data: session } = useSession();
    const pathname = usePathname();
  
    if (!session?.user?.id) return null;
  return (
  <div>
    
      <header className='py-8 xl:py-12 text-white '>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href="/">
          <h1 className='text-4xl font-bold  text-blue-500 dark:text-white'>
          🩺DR <span className='text-accent text-blue-700 dark:text-blue-400'>Port.</span>
          </h1>

        </Link>

        <div className='hidden xl:flex items-center gap-8'>


          <Nav />
          <Link href={`/${session.user.id}/chamber`}>
      

            <Button
              variant="outline"
              size="lg"
              className="text-cyan-800 dark:text-cyan-300 text-xl hover:text-black dark:hover:text-white"
            >
              Chamber
            </Button>

          </Link>
        </div>

        <div className='xl:hidden '>
<MobileNav />
        </div>
      </div>
    </header>
  </div>
  )
}
