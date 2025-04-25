'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiUser, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { sendEmail } from '@/utils/sendGmail';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

interface AppointmentStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export default function AppointmentList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  const [currentContact, setCurrentContact] = useState<Contact | null>(null);


  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/users/${userId}/appointments`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();

      setContacts(data.appointments || []);
      setStats({
        total: data.appointments.length,
        pending: data.appointments.filter((c: Contact) => c.status === 'pending').length,
        accepted: data.appointments.filter((c: Contact) => c.status === 'accepted').length,
        rejected: data.appointments.filter((c: Contact) => c.status === 'rejected').length,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAppointments();
  }, [userId]);

  const handleStatusChange = async (contactId: string, newStatus: 'accepted' | 'rejected') => {
    if (!userId || !contactId) {
      setError('Missing required IDs');
      return;
    }

    try {
      setUpdatingStatus(contactId);

      const contact = contacts.find(c => c._id === contactId);
      if (!contact) throw new Error("Contact not found");

      setContacts(prev => prev.map(contact =>
        contact._id === contactId ? { ...contact, status: newStatus } : contact
      ));

      const response = await fetch(`/api/appointments/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const emailResponse = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          to: contact.email,
          subject: newStatus === 'accepted' ? 'Appointment Accepted' : 'Appointment Rejected',
          text: `Your appointment has been ${newStatus}.`,
          html: `<p>Your appointment has been <strong>${newStatus}</strong> by DR <strong>${userId}</strong>.</p>`
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email');
      }

      const statsRes = await fetch(`/api/users/${userId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.appointmentStats || stats);
      }

    } catch (err) {
      console.error("Update error:", err);
      setContacts(prev => prev.map(contact =>
        contact._id === contactId ? { ...contact, status: 'pending' } : contact
      ));
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentContact) return;

    try {
      // Send the appointment details to the backend
      const response = await fetch(`/api/appointments/${currentContact._id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          message,
          contactId: currentContact._id,
          patientEmail: currentContact.email,
        }),
      });

      if (response.ok) {
        // Close the modal and refresh the appointments list
        setIsModalOpen(false);
        fetchAppointments(); // You already have this function to refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send appointment details');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Failed to send appointment details');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Error Loading Appointments</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen text-center p-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">No Appointments Found</h2>
        <p className="text-gray-600">You don't have any appointments yet.</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointment List</h1>
            <p className="text-gray-600 mt-2">
              {stats.total} appointment{stats.total !== 1 ? 's' : ''} found
              {stats.pending > 0 && (
                <span className="ml-2 text-blue-600">({stats.pending} pending)</span>
              )}
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {contacts.map((contact) => (
            <motion.div
              key={contact._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl w-full p-6 shadow-md transition-all duration-300 flex flex-col ${contact.status === 'accepted' ? 'bg-green-50 border-l-4 border-green-500' : contact.status === 'rejected' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white hover:shadow-lg'}`}
            >
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-full mr-4 ${contact.status === 'accepted' ? 'bg-green-100' : contact.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <FiUser className={`text-xl ${contact.status === 'accepted' ? 'text-green-600' : contact.status === 'rejected' ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiClock className="mr-1" />
                    <span>
                      {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {new Date(contact.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
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
                    disabled={updatingStatus === contact._id}
                    className="px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center"
                  >
                    <FiX className="mr-2" /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(contact._id, 'accepted')}
                    disabled={updatingStatus === contact._id}
                    className="px-4 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors flex items-center"
                  >
                    <FiCheck className="mr-2" /> Accept
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${contact.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {contact.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                  {contact.updatedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(contact.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>


        {/* Appointment Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 my-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment Summary</h2>
          <div className="space-y-6">
            {Object.entries({
              total: { label: 'Total Appointments', color: 'bg-blue-500' },
              pending: { label: 'Pending Appointments', color: 'bg-yellow-500' },
              accepted: { label: 'Accepted Appointments', color: 'bg-green-500' },
              rejected: { label: 'Rejected Appointments', color: 'bg-red-500' },
            }).map(([key, { label, color }]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{label}</span>
                  <span className="font-bold">{stats[key as keyof AppointmentStats]}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{
                      width: `${stats.total ? (stats[key as keyof AppointmentStats] / stats.total) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
