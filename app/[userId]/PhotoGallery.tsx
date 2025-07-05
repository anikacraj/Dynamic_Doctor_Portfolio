'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryPhotoProps {
  userId: string;
}

export default function PhotoGallery({ userId }: GalleryPhotoProps) {
  const [images, setImages] = useState<string[]>([]) // Array of image URLs
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch gallery photos from backend
  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`) // Get user details
        const data = await response.json()

        if (Array.isArray(data?.gallery)) {
          setImages(data.gallery) // Set gallery image URLs
        } else {
          console.error('No gallery data found in user response:', data)
        }
      } catch (error) {
        console.error('Failed to fetch gallery photos:', error)
      }
    }

    if (userId) fetchGalleryPhotos()
  }, [userId])

  // Handle screen resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const initialCount = isMobile ? 6 : 12
  const displayedImages = showAll ? images : images.slice(0, initialCount)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-center mb-10">
        📸 Doctor’s Gallery
      </h1>

      {/* Image Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 border-2 p-4 border-white rounded-2xl"
      >
        {displayedImages.length > 0 ? (
          displayedImages.map((imgUrl, index) => (
            <motion.div
              key={index}
              layout
              className="relative group overflow-hidden rounded-xl shadow-md bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-44 sm:h-52 w-full">
                <Image
                  src={imgUrl}
                  alt={`Gallery Photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No gallery photos found.
          </p>
        )}
      </motion.div>

      {/* Buttons */}
      {images.length > initialCount && (
        <div className="flex justify-center mt-10">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
            >
              View All Photos
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full shadow hover:bg-gray-400 transition"
            >
              Back
            </button>
          )}
        </div>
      )}
    </div>
  )
}
