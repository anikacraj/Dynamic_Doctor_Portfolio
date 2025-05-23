// app\[userId]\blog\page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Blog {
  _id: string;
  heading: string;
  images?: string[];
  text: string;
  createdAt: string;
  updatedAt?: string;
  like: number;
  doctorId: string; // needed for clicks and routing
}

export default function BlogPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  // Use params.userId or fallback to logged in user id if params.userId missing
  const sessionUserId = session?.user?.id || '';
  const paramUserId = params?.userId || sessionUserId;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const isOwner = sessionUserId === paramUserId;

  useEffect(() => {
    if ((status === 'authenticated' || status === 'unauthenticated') && paramUserId) {
      fetchUserBlogs(paramUserId);
    }
  }, [status, paramUserId]);

  useEffect(() => {
    const filtered = blogs.filter((blog) =>
      blog.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const fetchUserBlogs = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/blog/CreateBlog`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();

      // Add doctorId to each blog item
      const blogsWithDoctorId = data.map((blog: Blog) => ({
        ...blog,
        doctorId: userId,
      }));

      setBlogs(blogsWithDoctorId);
      setFilteredBlogs(blogsWithDoctorId);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoadingBlogs(false);
    }
  };
// app/[userId]/blog/page.tsx

// app/[userId]/blog/page.tsx

const handleReadMoreClick = async (
  e: React.MouseEvent<HTMLAnchorElement>,
  blogId: string,
  doctorId: string
) => {
  e.preventDefault();

  const currentUserId = sessionUserId; // `undefined` if not logged in

  // Prevent the blog owner from incrementing their own clicks
  if (currentUserId === doctorId) {
    router.push(`/${doctorId}/blog/${blogId}`);
    return;
  }

  try {
    const res = await fetch(`/api/users/${doctorId}/blog/${blogId}/click`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Send the current user ID if logged in (optional tracking)
        ...(currentUserId && { 'x-user-id': currentUserId }),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Click update failed:', errorData.error);
      router.push(`/${doctorId}/blog/${blogId}`);
      return;
    }

    const result = await res.json();

    // Optimistically update UI
    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === blogId ? { ...blog, like: result.like } : blog
      )
    );
    setFilteredBlogs((prev) =>
      prev.map((blog) =>
        blog._id === blogId ? { ...blog, like: result.like } : blog
      )
    );
  } catch (err) {
    console.error('Error increasing view count:', err);
  } finally {
    router.push(`/${doctorId}/blog/${blogId}`);
  }
};

  const handleDelete = async (blogId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${paramUserId}/blog/${blogId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete blog');

      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      setFilteredBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete blog.');
    }
  };

  if (!paramUserId) {
    return (
      <div className="p-6 text-red-600 font-bold">
        Invalid or missing user ID in URL.
      </div>
    );
  }

  if (status === 'loading') return <div className="p-6">Loading...</div>;

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-white to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Doctor's Blogs</h1>
          <p className="text-gray-600 text-sm">Total Blogs: {blogs.length}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by heading..."
            className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isOwner && (
            <button
              onClick={() => router.push(`/${paramUserId}/blog/CreateBlog`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              + Create Blog
            </button>
          )}
        </div>
      </div>

      {loadingBlogs ? (
        <p>Loading blogs...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
            >
              <Link
                href={`/${paramUserId}/blog/${blog._id}`}
                onClick={(e) => handleReadMoreClick(e, blog._id, blog.doctorId)}
              >
               {blog.images && blog.images.length > 0 && blog.images[0] ? (
  <img
    src={blog.images[0]}
    alt="Blog Image"
    className="w-full h-48 object-cover"
  />
) : (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
    No Image
  </div>
)}
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 px-4 py-2">
                  {blog.heading}
                </h2>
              </Link>

              <div className="text-sm text-gray-600 mb-2 flex justify-between px-4">
                <span>views {blog.like ?? 0}</span>
                <span className="text-xs">
                  Created: {new Date(blog.createdAt).toLocaleString()}
                </span>
                {blog.updatedAt && (
                  <span className="text-xs">
                    Updated: {new Date(blog.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>

              {isOwner && (
                <div className="flex justify-between mt-2 px-4 pb-4">
                  <button
                    onClick={() => router.push(`/${paramUserId}/blog/${blog._id}/edit`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
