"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useParams } from "next/navigation";

interface DoctorProfile {
  name: string;
  email: string;
  phoneNo: string;
  optionalEmail: string;
  registerId: string;
  specialization: string;
  mbbsCollege: string;
  profilePhoto: string;
  ContactNo: string;
  bio: string;
  aboutPicture: string;
  fbLink: string;
  instagram: string;
  Linkedin: string;
  youTubeLink: string;
  degrees: { name: string; college: string; year: string }[];
  education: { year: string; examName: string; institute: string }[];
  work: { role: string; college: string; day: string; time: string; collegePhoneNumber: string }[];
  experience: { role: string; college: string; startingYear: string; endingYear: string }[];
  chamber: { place: string; day: string; time: string; bookContact: string }[];
  gallery: string[];
}

const initialFormState: DoctorProfile = {
  name: "",
  email: "",
  phoneNo: "",
  optionalEmail: "",
  registerId: "",
  specialization: "",
  mbbsCollege: "",
  profilePhoto: "",
  ContactNo: "",
  bio: "",
  aboutPicture: "",
  fbLink: "",
  instagram: "",
  Linkedin: "",
  youTubeLink: "",
  degrees: [],
  education: [],
  work: [],
  experience: [],
  chamber: [],
  gallery: [],
};

export default function DoctorProfileEditor() {
  const { userId } = useParams();
  const [user, setUser] = useState<DoctorProfile | null>(null);
  const [formData, setFormData] = useState<DoctorProfile>(initialFormState);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const cleanedData = Object.entries(data).reduce((acc: any, [key, value]) => {
          acc[key] = value !== undefined ? value : initialFormState[key as keyof DoctorProfile];
          return acc;
        }, {});
        setUser(cleanedData);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...initialFormState,
        ...user,
        degrees: user.degrees?.length ? user.degrees : [],
        education: user.education?.length ? user.education : [],
        work: user.work?.length ? user.work : [],
        experience: user.experience?.length ? user.experience : [],
        chamber: user.chamber?.length ? user.chamber : [],
        gallery: user.gallery?.length ? user.gallery : [],
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDegreeChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.degrees];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, degrees: updated };
    });
  };

  const addDegree = () => setFormData(prev => ({
    ...prev,
    degrees: [...prev.degrees, { name: "", college: "", year: "" }]
  }));

  const removeDegree = (index: number) => setFormData(prev => ({
    ...prev,
    degrees: prev.degrees.filter((_, i) => i !== index)
  }));

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => setFormData(prev => ({
    ...prev,
    education: [...prev.education, { year: "", examName: "", institute: "" }]
  }));

  const removeEducation = (index: number) => setFormData(prev => ({
    ...prev,
    education: prev.education.filter((_, i) => i !== index)
  }));

  const handleWorkChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.work];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, work: updated };
    });
  };

  const addWork = () => setFormData(prev => ({
    ...prev,
    work: [...prev.work, { role: "", college: "", day: "", time: "", collegePhoneNumber: "" }]
  }));

  const removeWork = (index: number) => setFormData(prev => ({
    ...prev,
    work: prev.work.filter((_, i) => i !== index)
  }));

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => setFormData(prev => ({
    ...prev,
    experience: [...prev.experience, { role: "", college: "", startingYear: "", endingYear: "" }]
  }));

  const removeExperience = (index: number) => setFormData(prev => ({
    ...prev,
    experience: prev.experience.filter((_, i) => i !== index)
  }));

  const handleChamberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.chamber];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, chamber: updated };
    });
  };

  const addChamber = () => setFormData(prev => ({
    ...prev,
    chamber: [...prev.chamber, { place: "", day: "", time: "", bookContact: "" }]
  }));

  const removeChamber = (index: number) => setFormData(prev => ({
    ...prev,
    chamber: prev.chamber.filter((_, i) => i !== index)
  }));

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, profilePhoto: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutPictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, aboutPicture: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, bio: e.target.value }));
  };


  const handleSocialMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => setFormData(prev => ({
    ...prev,
    gallery: prev.gallery.filter((_, i) => i !== index)
  }));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.details?.join("\n") ||
          "Failed to update profile"
        );
      }

      alert("Profile updated successfully!");
      console.log("Updated data:", data);

    } catch (error) {
      console.error("Update error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Doctor Profile Editor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xl text-blue-500 font-medium mb-1">Name : </label>
              <div className="text-2xl font-semibold">DR. {user?.name}</div>
            </div>
            <div>
              <label className="block text-2xl font-medium mb-1">Email</label>
              <div className="text-xl italic">{user?.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email*</label>
              <input type="email" name="optionalEmail" value={formData.optionalEmail || ""} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number*</label>
              <input type="number" name="ContactNo" value={formData.ContactNo || ""} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Register ID*</label>
              <input type="text" name="registerId" value={formData.registerId || ""} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization*</label>
              <input type="text" name="specialization" value={formData.specialization || ""} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            {/* In your basic information section */}
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleBioChange}
                className="w-full p-2 border rounded h-32"
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MBBS College*</label>
              <input type="text" name="mbbsCollege" value={formData.mbbsCollege || ""} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="w-full p-2 border rounded" />
            {formData.profilePhoto && <img src={formData.profilePhoto} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded border" />}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">About Page Photo</label>
            <input type="file" accept="image/*" onChange={handleAboutPictureChange} className="w-full p-2 border rounded" />
            {formData.aboutPicture && <img src={formData.aboutPicture} alt="aboutPicture" className="mt-2 w-32 h-32 object-cover rounded border" />}
          </div>
        </div>

        {/* Keep all other sections (Degrees, Education, Work, etc.) with the same pattern of || "" for values */}

        {/* Degrees Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Degrees</h2>
          {(formData.degrees || []).map((degree, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Degree Name</label>
                <input
                  type="text"
                  value={degree.name || ""}
                  onChange={(e) => handleDegreeChange(index, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">College</label>
                <input
                  type="text"
                  value={degree.college || ""}
                  onChange={(e) => handleDegreeChange(index, "college", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  value={degree.year || ""}
                  onChange={(e) => handleDegreeChange(index, "year", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeDegree(index)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDegree}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Degree
          </button>
        </div>

        {/* Education Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          {(formData.education || []).map((edu, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  value={edu.year || ""}
                  onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exam Name</label>
                <input
                  type="text"
                  value={edu.examName || ""}
                  onChange={(e) => handleEducationChange(index, "examName", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institute</label>
                <input
                  type="text"
                  value={edu.institute || ""}
                  onChange={(e) => handleEducationChange(index, "institute", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Education
          </button>
        </div>

        {/* Work Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Work Information</h2>
          {(formData.work || []).map((work, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={work.role || ""}
                  onChange={(e) => handleWorkChange(index, "role", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution</label>
                <input
                  type="text"
                  value={work.college || ""}
                  onChange={(e) => handleWorkChange(index, "college", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <input
                  type="text"
                  value={work.day || ""}
                  onChange={(e) => handleWorkChange(index, "day", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={work.time || ""}
                  onChange={(e) => handleWorkChange(index, "time", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <input
                  type="text"
                  value={work.collegePhoneNumber || ""}
                  onChange={(e) => handleWorkChange(index, "collegePhoneNumber", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeWork(index)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addWork}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Work
          </button>
        </div>

        {/* Experience Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          {(formData.experience || []).map((exp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={exp.role || ""}
                  onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution</label>
                <input
                  type="text"
                  value={exp.college || ""}
                  onChange={(e) => handleExperienceChange(index, "college", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Year</label>
                <input
                  type="text"
                  value={exp.startingYear || ""}
                  onChange={(e) => handleExperienceChange(index, "startingYear", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Year</label>
                <input
                  type="text"
                  value={exp.endingYear || ""}
                  onChange={(e) => handleExperienceChange(index, "endingYear", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Experience
          </button>
        </div>

        {/* Chamber Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Chamber</h2>
          {(formData.chamber || []).map((chamber, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Place</label>
                <input
                  type="text"
                  value={chamber.place || ""}
                  onChange={(e) => handleChamberChange(index, "place", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <input
                  type="text"
                  value={chamber.day || ""}
                  onChange={(e) => handleChamberChange(index, "day", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={chamber.time || ""}
                  onChange={(e) => handleChamberChange(index, "time", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact</label>
                <input
                  type="text"
                  value={chamber.bookContact || ""}
                  onChange={(e) => handleChamberChange(index, "bookContact", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeChamber(index)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addChamber}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Chamber
          </button>
        </div>

        {/* Gallery Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {(formData.gallery || []).map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-48 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Add Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

{/* Add this section inside your Basic Information div */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Facebook */}
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook Profile URL
      </label>
      <input
        type="url"
        name="fbLink"
        value={formData.fbLink || ""}
        onChange={handleChange}
        placeholder="https://facebook.com/yourprofile"
        className="w-full p-2 border rounded"
      />
    </div>

    {/* Instagram */}
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        Instagram Profile URL
      </label>
      <input
        type="url"
        name="instagram"
        value={formData.instagram || ""}
        onChange={handleChange}
        placeholder="https://instagram.com/yourprofile"
        className="w-full p-2 border rounded"
      />
    </div>

    {/* LinkedIn */}
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        LinkedIn Profile URL
      </label>
      <input
        type="url"
        name="Linkedin"
        value={formData.Linkedin || ""}
        onChange={handleChange}
        placeholder="https://linkedin.com/in/yourprofile"
        className="w-full p-2 border rounded"
      />
    </div>

    {/* YouTube */}
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        YouTube Channel URL
      </label>
      <input
        type="url"
        name="youTubeLink"
        value={formData.youTubeLink || ""}
        onChange={handleChange}
        placeholder="https://youtube.com/yourchannel"
        className="w-full p-2 border rounded"
      />
    </div>
  </div>
</div>
        <div className="text-center">
          <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}