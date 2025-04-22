'use client'

import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PhotoGallery() {
  const [images, setImages] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const dummyData = Array.from({ length: 30 }).map((_, i) => ({
      _id: String(i),
      imageUrl: `/gallery/photo${(i % 5) + 1}.jpg`,
      caption: `Picture ${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
    }))
    setImages(dummyData.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img._id !== id))
  }

  const initialCount = isMobile ? 6 : 12
  const displayedImages = showAll ? images : images.slice(0, initialCount)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 ">
      <h1 className="text-2xl sm:text-4xl  font-bold text-center mb-10">📸 Doctor’s Gallery</h1>

      {/* Image Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 border-2 p-4 border-white rounded-2xl "
      >
        {displayedImages.map((img) => (
          <motion.div
            key={img._id}
            layout
            className="relative group overflow-hidden rounded-xl shadow-md bg-white hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-44 sm:h-52 w-full">
              <Image
                src={img.imageUrl}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm sm:text-base">{img.caption}</h3>
              <p className="text-xs text-gray-500">
                {new Date(img.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <FaTrash size={14} />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Buttons */}
      <div className="flex justify-center mt-10">
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
          >
            View All Photos
          </button>
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full shadow hover:bg-gray-400 transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}
