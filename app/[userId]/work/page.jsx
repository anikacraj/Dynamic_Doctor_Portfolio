"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WorkPage({ params }) {
  const [workList, setWorkList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await fetch(`/api/users/${params.userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch work data");
        }
        const data = await res.json();
        setWorkList(data.work || []); // fetch work array
      } catch (error) {
        console.error("Error fetching work data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) fetchWork();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading work schedule...</p>
      </div>
    );
  }

  if (workList.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">No work schedule found for this doctor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-min w-full sm:w-3/4 mx-auto bg-gradient-to-br border-2 rounded-2xl border-amber-500 from-white to-green-50 py-10 px-4 sm:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-700 mb-12">
        MY WORK
      </h1>
      <hr />
      <br />
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {workList.map((wk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white shadow-xl rounded-2xl p-6 border border-green-100 hover:shadow-green-200 transition-all duration-300"
          >
            <h2 className="text-xl font-extrabold text-blue-900 mb-2">
              {wk.role}
            </h2>
            <p className="text-gray-600 font-bold">{wk.college}</p>
            <p className="text-gray-900 font-semibold">{wk.collegePhoneNumber}</p>
            <p className="text-gray-500 italic font-serif">{wk.day}</p>
            <p className="text-gray-500 italic">{wk.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
