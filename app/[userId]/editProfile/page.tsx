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
  degrees: { name: string; college: string; year: string }[];
  work: { college: string; day: string; time: string }[];
  experience: { college: string; startingYear: string; endingYear: string }[];
  chamber: { place: string; day: string; time: string }[];
  gallery: string[];
}

export default function DoctorProfileEditor() {
  const { userId } = useParams();
  const [user, setUser] = useState<DoctorProfile | null>(null);

  const [formData, setFormData] = useState<DoctorProfile>({
    name: "",
    email: "",
    phoneNo: "",
    optionalEmail: "",
    registerId: "",
    specialization: "",
    mbbsCollege: "",
    profilePhoto: "",
    degrees: [],
    work: [],
    experience: [],
    chamber: [],
    gallery: [],
  });

  // Fetch user
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user:", data); // debug
        setUser(data);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDegreeChange = (index: number, field: string, value: string) => {
    const updated = [...formData.degrees];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, degrees: updated });
  };
  const addDegree = () => {
    const updatedDegrees = [...(formData.degrees || []), { name: "", college: "", year: "" }];
    setFormData((prev) => ({ ...prev, degrees: updatedDegrees }));
    console.log("Added degree:", updatedDegrees);
  };
  const removeDegree = (index: number) => setFormData({ ...formData, degrees: formData.degrees.filter((_, i) => i !== index) });

  const handleWorkChange = (index: number, field: string, value: string) => {
    const updated = [...formData.work];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, work: updated });
  };
  const addWork = () => setFormData({ ...formData, work: [...formData.work, { college: "", day: "", time: "" }] });
  const removeWork = (index: number) => setFormData({ ...formData, work: formData.work.filter((_, i) => i !== index) });

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experience: updated });
  };
  const addExperience = () => setFormData({ ...formData, experience: [...formData.experience, { college: "", startingYear: "", endingYear: "" }] });
  const removeExperience = (index: number) => setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });

  const handleChamberChange = (index: number, field: string, value: string) => {
    const updated = [...formData.chamber];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, chamber: updated });
  };
  const addChamber = () => setFormData({ ...formData, chamber: [...formData.chamber, { place: "", day: "", time: "" }] });
  const removeChamber = (index: number) => setFormData({ ...formData, chamber: formData.chamber.filter((_, i) => i !== index) });

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, profilePhoto: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
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
              setFormData({ ...formData, gallery: [...formData.gallery, ...newImages] });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  // ✅ Final form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Simple validation
    if (!formData.name || !formData.email || !formData.specialization) {
      alert("Name, email, and specialization are required.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Updated user:", data);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while saving the profile.");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Doctor Profile Editor</h1>
    
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
       

              <label className="block text-2xl text-blue-500 font-medium mb-1">Name : </label>
             <div className="text-2xl font-semibold ">
            DR.  {user?.name}
             </div>
            </div>
            
            <div>
              <label className="block text-2xl font-medium mb-1 ">Email</label>
              <div className="text-xl italic ">
              {user?.email}
             </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number*</label>
              <div className="text-xl italic ">
              {user?.email}
             </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Optional Email</label>
              <input
                type="email"
                name="optionalEmail"
                value={formData.optionalEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Register ID*</label>
              <input
                type="text"
                name="registerId"
                value={formData.registerId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Specialization*</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">MBBS College*</label>
              <input
                type="text"
                name="mbbsCollege"
                value={formData.mbbsCollege}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="w-full p-2 border rounded"
            />
            {formData.profilePhoto && (
              <img
                src={formData.profilePhoto}
                alt="Profile"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>
        </div>
        
   {/* Degrees Section */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Degrees</h2>

  {(formData.degrees || []).map((degree, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Degree Name</label>
        <input
          type="text"
          value={degree.name}
          onChange={(e) => handleDegreeChange(index, "name", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">College</label>
        <input
          type="text"
          value={degree.college}
          onChange={(e) => handleDegreeChange(index, "college", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Year</label>
        <input
          type="text"
          value={degree.year}
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

{/* Work Section */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Work Information</h2>

  {formData.work?.map((work, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Institution</label>
        <input
          type="text"
          value={work.college}
          onChange={(e) => handleWorkChange(index, "college", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Days</label>
        <input
          type="text"
          value={work.day}
          onChange={(e) => handleWorkChange(index, "day", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Monday to Friday"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="text"
          value={work.time}
          onChange={(e) => handleWorkChange(index, "time", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., 9am-5pm"
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
    Add Work Information
  </button>
</div>

{/* Experience Section */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>

  {formData.experience?.map((exp, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Institution</label>
        <input
          type="text"
          value={exp.college}
          onChange={(e) => handleExperienceChange(index, "college", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Starting Year</label>
        <input
          type="text"
          value={exp.startingYear}
          onChange={(e) => handleExperienceChange(index, "startingYear", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ending Year</label>
        <input
          type="text"
          value={exp.endingYear}
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
  <h2 className="text-xl font-semibold mb-4">Chamber Details</h2>

  {formData.chamber?.map((chamber, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Place</label>
        <input
          type="text"
          value={chamber.place}
          onChange={(e) => handleChamberChange(index, "place", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Days</label>
        <input
          type="text"
          value={chamber.day}
          onChange={(e) => handleChamberChange(index, "day", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Monday to Friday"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="text"
          value={chamber.time}
          onChange={(e) => handleChamberChange(index, "time", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., 9am-5pm"
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
    Add Chamber Details
  </button>
</div>

{/* Gallery Section */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Gallery</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
    {formData.gallery?.map((image, index) => (
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
    <label className="block text-sm font-medium mb-1">Add Gallery Images</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleGalleryUpload}
      className="w-full p-2 border rounded"
    />
  </div>
</div>

{/* Submit Button */}
<div className="text-center">
  <button
    type="submit"
    className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
  >
    Save Profile
  </button>
</div>

      </form>
    </div>
  );
}