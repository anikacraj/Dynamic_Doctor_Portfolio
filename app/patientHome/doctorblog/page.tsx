'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Blog {
  _id: string;
  images?: string[];
  heading: string;
  text: string;
  doctorId: string;
  doctorName: string;
  createdAt: string;
  like: number;
}

export default function PatientHome() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs/all');
        const data = await res.json();
        setBlogs(data.blogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMoreClick = async (blogId: string, doctorId: string) => {
    try {
      // Only count view if not the author
      if (currentUserId !== doctorId) {
        await fetch(`/api/users/${doctorId}/blog/${blogId}/click`, {
          method: 'PUT', // ✅ Correct HTTP method
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUserId,
          },
        });

        // ✅ Optimistically update like count in UI
        setBlogs(prev =>
          prev.map(blog =>
            blog._id === blogId
              ? { ...blog, like: (blog.like || 0) + 1 }
              : blog
          )
        );
      }
    } catch (err) {
      console.error('Error increasing view count:', err);
    } finally {
      router.push(`/${doctorId}/blog/${blogId}`);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Doctor Blogs</h2>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="bg-white border shadow-md rounded-xl overflow-hidden flex flex-col"
            >
              {/* Blog Image */}
              {blog.images && blog.images.length > 0 ? (
                <img
                  src={blog.images[0]}
                  alt="Blog Image"
                  className="w-full h-48 object-cover mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm mb-2">
                  No Image
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                {/* Heading */}
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                  {index + 1}. {blog.heading}
                </h3>

                {/* Doctor Name & Time */}
                <p className="text-sm text-gray-600 mb-2">
                  By Dr. {blog.doctorName} •{' '}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                {/* Blog Preview */}
                <p className="text-sm text-gray-700 flex-1 mb-3">
                  {blog.text.slice(0, 100)}...
                </p>

                {/* Like/View Counter + Read More */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Views: {blog.like ?? 0}</span>
                  <button
                    onClick={() =>
                      handleReadMoreClick(blog._id, blog.doctorId)
                    }
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
