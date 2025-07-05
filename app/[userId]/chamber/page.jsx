"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ChamberPage({ params }) {
  const [chambers, setChambers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChambers = async () => {
      try {
        const response = await fetch(`/api/users/${params.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chamber data");
        }
        const data = await response.json();
        setChambers(data.chamber || []); // fetch the chamber array from backend
      } catch (error) {
        console.error("Error fetching chamber data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) fetchChambers();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading chambers...</p>
      </div>
    );
  }

  if (chambers.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">No chambers found for this doctor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:min-h-[30vh] sm:mt-10 border-2 border-blue-400 rounded-2xl w-full sm:w-3/4 mx-auto bg-gradient-to-br from-blue-50 to-white p-6 xl:p-12">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl xl:text-5xl font-bold text-center text-blue-700 mb-12"
      >
        Doctor's Chambers
      </motion.h1>
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-8 max-w-7xl mx-auto">
        {chambers.map((chamber, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500"
          >
            <h2 className="text-xl xl:text-2xl font-semibold text-blue-600 mb-4">
              Chamber #{index + 1}
            </h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>{chamber.place}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <FaCalendarAlt className="text-blue-500" />
              <span>{chamber.day}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaClock className="text-blue-500" />
              <span>{chamber.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaClock className="text-blue-500" />
              <span>Phone: {chamber.bookContact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
