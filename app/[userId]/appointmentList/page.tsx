"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiUser, FiClock, FiCheck, FiX } from "react-icons/fi";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  message?: string;
  createdAt: string;
  status?: 'pending' | 'accepted' | 'rejected'; // Added status field
}

interface UserData {
  contacts: Contact[];
}

export default function AppointmentList() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then((data: UserData) => {
        // Initialize status for each contact and sort by newest first
        const processedContacts = {
          ...data,
          contacts: data.contacts.map(contact => ({
            ...contact,
            status: contact.status || 'pending' // Default to pending if no status
          })).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        };
        setUser(processedContacts);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching users:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleStatusChange = (contactId: string, newStatus: 'accepted' | 'rejected') => {
    if (!user) return;
    
    setUser({
      ...user,
      contacts: user.contacts.map(contact => 
        contact._id === contactId ? { ...contact, status: newStatus } : contact
      )
    });

    // In a real app, you would also update the status in your database here
    // fetch(`/api/appointments/${contactId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: newStatus })
    // });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Count appointments by status
  const appointmentCounts = {
    total: user?.contacts.length || 0,
    accepted: user?.contacts.filter(c => c.status === 'accepted').length || 0,
    rejected: user?.contacts.filter(c => c.status === 'rejected').length || 0,
    pending: user?.contacts.filter(c => c.status === 'pending').length || 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user?.contacts || user.contacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen text-center p-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          No Appointments Found
        </h2>
        <p className="text-gray-600">
          You don't have any appointments yet.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >

<div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment Summary</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Total Appointments</h3>
                <span className="font-bold text-gray-800">{appointmentCounts.total}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Accepted Appointments</h3>
                <span className="font-bold text-green-600">{appointmentCounts.accepted}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(appointmentCounts.accepted / appointmentCounts.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Rejected Appointments</h3>
                <span className="font-bold text-red-600">{appointmentCounts.rejected}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(appointmentCounts.rejected / appointmentCounts.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Pending Appointments</h3>
                <span className="font-bold text-yellow-600">{appointmentCounts.pending}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(appointmentCounts.pending / appointmentCounts.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 mt-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Appointment List
            </h1>
            <p className="text-gray-600 mt-2">
              {appointmentCounts.total} appointment{appointmentCounts.total !== 1 ? 's' : ''} found
              {appointmentCounts.pending > 0 && (
                <span className="ml-2 text-blue-600">
                  ({appointmentCounts.pending} pending)
                </span>
              )}
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {user.contacts.map((contact) => (
            <motion.div
              key={contact._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl w-full p-6 shadow-md transition-all duration-300 flex flex-col ${
                contact.status === 'accepted' 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : contact.status === 'rejected' 
                    ? 'bg-red-50 border-l-4 border-red-500' 
                    : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-full mr-4 ${
                  contact.status === 'accepted' 
                    ? 'bg-green-100' 
                    : contact.status === 'rejected' 
                      ? 'bg-red-100' 
                      : 'bg-blue-100'
                }`}>
                  <FiUser className={`text-xl ${
                    contact.status === 'accepted' 
                      ? 'text-green-600' 
                      : contact.status === 'rejected' 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {contact.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiClock className="mr-1" />
                    <span>
                      {new Date(contact.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {new Date(contact.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                <div className="flex items-start">
                  <FiMail className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 break-all">{contact.email}</span>
                </div>

                <div className="flex items-center">
                  <FiPhone className="text-gray-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">{contact.phoneNo}</span>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{contact.address}</span>
                </div>

                {contact.message && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 italic">"{contact.message}"</p>
                  </div>
                )}
              </div>

              {contact.status === 'pending' ? (
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusChange(contact._id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center"
                  >
                    <FiX className="mr-2" /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(contact._id, 'accepted')}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors flex items-center"
                  >
                    <FiCheck className="mr-2" /> Accept
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    contact.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {contact.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Appointment Summary Section */}
       
      </motion.div>
    </div>
  );
}