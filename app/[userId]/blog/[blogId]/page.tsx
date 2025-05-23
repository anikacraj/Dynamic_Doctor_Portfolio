'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Blog {
  _id: string;
  heading: string;
  text: string;
  images?: string[];
  createdAt: string;
  like: number;
}

export default function BlogDetailPage() {
 const { userId, blogId } = useParams() as { userId: string; blogId: string };
  const [blog, setBlog] = useState<Blog | null>(null);
   const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/blog/${blogId}`);
        const data = await res.json();
        if (res.ok) {
          setBlog(data.blog);
          setDoctorName(data.doctorName);
           setUpdatedAt(new Date(data.blog.updatedAt).toLocaleString()); 
        } else {
          console.error('Error loading blog:', data.error);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [userId, blogId]);

  if (loading) return <div className="p-6">Loading blog...</div>;
  if (!blog) return <div className="p-6 text-red-600">Blog not  found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-6">
     {blog.images && blog.images.length > 0 && (
  <div className="grid grid-cols-1 gap-4 ">
    {blog.images.map((imgUrl, index) => (
      <img
        key={index}
        src={imgUrl}
        alt={`Blog Image ${index + 1}`}
        className="w-full h-64 object-cover rounded-md"
      />
    ))}
  </div>
)}

      <h1 className="text-3xl font-bold mb-2">{blog.heading}</h1>

      <p className="text-gray-600 text-sm mb-2">
        By Dr. {doctorName} • {new Date(blog.createdAt).toLocaleDateString()} • views: {blog.like}
      </p>

<div>
      {updatedAt && (
        <p className="text-sm text-gray-500 mt-4">Last modified: {updatedAt}</p>
      )}
    </div>


      <hr className="my-4" />

      <p className="text-gray-800 text-base whitespace-pre-line">{blog.text}</p>
    </div>
  );
}
