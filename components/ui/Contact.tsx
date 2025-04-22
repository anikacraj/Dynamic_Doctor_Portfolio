'use client'

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
  
    console.log("Submitting form with data:", {
      name,
      email,
      address,
      phone,
      message,
      userId: session?.user?.id
    });
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          address,
          phoneNo: phone,
          message,
          userId: session?.user?.id
        }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
  
      setName('');
      setEmail('');
      setAddress('');
      setPhone('');
      setMessage('');
      
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error('Full submission error:', error);
      setSubmitError(error.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative border-1 sm:border-2 border-blue-500 rounded-2xl min-h-screen sm:min-h-[20vh] 
    w-full sm:p-15 sm:pt-18 sm:w-3/4 mx-auto mt-3 bg-gradient-to-br from-[#d0f4de] via-[#fef9ef] to-[#fcbf49] flex items-center justify-center xl:p-6 p-2 overflow-hidden">

      {/* Glow Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-300 rounded-full opacity-20 blur-3xl z-0"></div>

      <div className="relative z-10 w-full sm:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">

        {/* Left Side: Contact Info + Socials */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col w-full items-center justify-between space-y-8 sm:items-start"
        >
          <div className="text-center sm:text-left order-3 sm:order-none">
            <h2 className="sm:text-4xl text-2xl font-bold text-gray-800 mb-1 font-serif">Let's Connect</h2>
            <p className="text-gray-700 mb-4">
              <span className='font-semibold'> 📞</span> <span className="font-small sm:font-medium">+8801234567890</span><br />
              <span className="font-serif">Available from 10 PM to 6 PM</span>
            </p>
          </div>

          {/* 3D IMAGE */}
          <div className="order-1 sm:order-none lg:w-[320px] lg:h-[350px] w-[280px] h-[280px] sm:mt-[-50px] relative overflow-hidden shadow-xl ring-1 ring-gray-200 rounded-full sm:rounded-xl">
            <Image
              src="/contactDr.png"
              priority
              quality={100}
              alt="dr photo"
              fill
              className="object-cover"
            />
          </div>

          {/* SOCIALS */}
          <div className="flex space-x-4 order-2 sm:order-none mb-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/30 backdrop-blur-xl p-3 rounded-full shadow-md hover:scale-110 transition-all">
              <FaFacebookF className="text-blue-600 text-xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/30 backdrop-blur-xl p-3 rounded-full shadow-md hover:scale-110 transition-all">
              <FaInstagram className="text-pink-500 text-xl" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white/30 backdrop-blur-xl p-3 rounded-full shadow-md hover:scale-110 transition-all">
              <FaLinkedinIn className="text-blue-700 text-xl" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/30 backdrop-blur-xl p-3 rounded-full shadow-md hover:scale-110 transition-all">
              <FaYoutube className="text-red-600 text-xl" />
            </a>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl">
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              Message sent successfully!
            </div>
          )}

          <div>
            <label className="block text-gray-800 font-medium mb-1">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/70 shadow-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="example@email.com"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/70 shadow-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Address</label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Enter your address"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/70 shadow-md"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Phone</label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="tel"
              placeholder="+880..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/70 shadow-md"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Message</label>
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              rows={4}
              cols={10}
              placeholder="Write your message..."
              className="w-full p-3 rounded-xl border resize-none border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/70 shadow-md"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}