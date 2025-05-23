'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function EditBlogPage() {
  const { data: session } = useSession();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const { userId, blogId } = params;

  useEffect(() => {
    if (userId && blogId) fetchBlog();
  }, [userId, blogId]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/blog/${blogId}`);
      const data = await res.json();
      if (res.ok) {
        const blog = data.blog;
        setHeading(blog.heading);
        setText(blog.text);
        setImages(blog.images || []);
        setUpdatedAt(new Date(blog.updatedAt).toLocaleString());
      } else {
        alert(data.error || 'Failed to fetch blog');
      }
    } catch (err) {
      console.error('Fetch blog error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/blog/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading, text }),
      });

      const data = await res.json();

      if (res.ok) {
        setUpdatedAt(new Date(data.blog.updatedAt).toLocaleString());
        alert('Blog updated successfully');
      } else {
        alert(data.error || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Update blog error:', err);
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Heading</label>
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 h-40"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Blog image ${index + 1}`}
              width={200}
              height={120}
              className="rounded border"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Save Changes
      </button>

      {updatedAt && (
        <p className="text-sm text-gray-500 mt-4">Last modified: {updatedAt}</p>
      )}
    </div>
  );
}
