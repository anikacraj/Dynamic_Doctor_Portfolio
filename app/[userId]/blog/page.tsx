'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const sessionUserId = session?.user?.id;
      const paramUserId = params.userId;

      if (sessionUserId === paramUserId) {
        setIsAuthorized(true);
      } else {
        // Unauthorized, redirect or show message
        router.push('/unauthorized'); // or use a 403 page
      }
    }
  }, [session, status, params.userId, router]);

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // or show a loading spinner or placeholder
  }

  const blogs = [
    {
      _id: '1',
      title: 'Developer Health Tips',
      summary: 'How to stay fit while coding...',
    },
    {
      _id: '2',
      title: 'Next.js 14 Features',
      summary: 'Exciting new updates in the Next.js framework...',
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-white to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
        <button
          onClick={() => router.push(`/${params.userId}/blog/CreateBlog`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          + Create Blog
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white shadow-lg rounded-xl p-5 cursor-pointer hover:shadow-xl"
            onClick={() => router.push(`/${params.userId}/blog/${blog._id}`)}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
            <p className="text-gray-600 text-sm">{blog.summary}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
