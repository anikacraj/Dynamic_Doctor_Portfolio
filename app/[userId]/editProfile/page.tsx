"use client";

import { useState, ChangeEvent, MouseEvent,useEffect } from "react";
import { useSession } from "next-auth/react";
import userModel from "@/models/user.model";
import { dbConnect } from "@/config/dbConnect";
import { IUser } from "@/models/user.model";
import { Chamber, Degree, DoctorProfile, Experience, Work } from "@/types/doctor";



interface DoctorProfileEditorProps {
  doctor: DoctorProfile;
}

export default function DoctorProfileEditor({ doctor }: DoctorProfileEditorProps) {
  const [formData, setFormData] = useState<DoctorProfile>(() => {
    const safeDoctor = doctor || {} as DoctorProfile;
    return {
      ...safeDoctor,
      degree: Array.isArray(safeDoctor.degree) ? safeDoctor.degree : [],
      work: Array.isArray(safeDoctor.work) ? safeDoctor.work : [],
      experience: Array.isArray(safeDoctor.experience) ? safeDoctor.experience : [],
      chamber: Array.isArray(safeDoctor.chamber) ? safeDoctor.chamber : [],
      gallery: Array.isArray(safeDoctor.gallery) ? safeDoctor.gallery : [],
      profilePhoto: safeDoctor.profilePhoto || "",
    };
  });

  const [editFields, setEditFields] = useState<Record<string, boolean>>({});
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [newProfilePhoto, setNewProfilePhoto] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: string) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ------------DEGREE-------------------------------------------------degree--------------degree

  const handleDegreeChange = (
    index: number,
    field: keyof Degree,
    value: string
  ) => {
    const updatedDegrees = [...(formData.degree ?? [])]; // handle undefined case
    updatedDegrees[index] = {
      ...updatedDegrees[index],
      [field]: value,
    };
    setFormData({ ...formData, degree: updatedDegrees });
  };
  
  const addDegree = () => {
    setFormData({
      ...formData,
      degree: [...(formData.degree ?? []), { name: "", college: "", year: "" }],
    });
  };
  
  const removeDegree = (index: number) => {
    const updatedDegrees = (formData.degree ?? []).filter((_, i) => i !== index);
    setFormData({ ...formData, degree: updatedDegrees });
  };

  // ---------------Work----------------work-------------------------work--------------------------


 // ---------------Work----------------work-------------------------work--------------------------

const handleWorkChange = (
  index: number,
  field: keyof Work,
  value: string
) => {
  const updatedWork = [...(formData.work ?? [])];
  updatedWork[index] = {
    ...updatedWork[index],
    [field]: value,
  };
  setFormData({ ...formData, work: updatedWork });
};

const addWork = () => {
  setFormData({
    ...formData,
    work: [...(formData.work ?? []), { college: "", day: "", time: "" }],
  });
};

const removeWork = (index: number) => {
  const updatedWork = (formData.work ?? []).filter((_, i) => i !== index);
  setFormData({ ...formData, work: updatedWork });
};

// -------------------------------experience----------------------experience--------------

const handleExperienceChange = (
  index: number,
  field: keyof Experience,
  value: string
) => {
  const updatedExperience = [...(formData.experience ?? [])];
  updatedExperience[index] = {
    ...updatedExperience[index],
    [field]: value,
  };
  setFormData({ ...formData, experience: updatedExperience });
};

const addExperience = () => {
  setFormData({
    ...formData,
    experience: [
      ...(formData.experience ?? []),
      { college: "", startingYear: "", endingYear: "" },
    ],
  });
};

const removeExperience = (index: number) => {
  const updatedExperience = (formData.experience ?? []).filter((_, i) => i !== index);
  setFormData({ ...formData, experience: updatedExperience });
};

//--------------------chamber------------------chamber-------------------------chamber----------

const handleChamberChange = (
  index: number,
  field: keyof Chamber, // ✅ Use proper casing (capitalized type name)
  value: string
) => {
  const updatedChamber = [...(formData.chamber ?? [])];
  updatedChamber[index] = {
    ...updatedChamber[index],
    [field]: value,
  };
  setFormData({ ...formData, chamber: updatedChamber });
};

const addChamber = () => {
  setFormData({
    ...formData,
    chamber: [...(formData.chamber ?? []), { place: "", day: "", time: "" }],
  });
};

const removeChamber = (index: number) => {
  const updatedChamber = (formData.chamber ?? []).filter((_, i) => i !== index);
  setFormData({ ...formData, chamber: updatedChamber });
};


  // const saveDegree = async () => {
  //   try {
  //     const response = await fetch("/api/save-degree", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ degree: formData.degree }),
  //     });

  //     if (response.ok) {
  //       alert("Degree information saved successfully!");
  //     } else {
  //       alert("Failed to save degree information.");
  //     }
  //   } catch (error) {
  //     alert("An error occurred while saving degree information.");
  //   }
  // };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setNewGalleryImages((prev) => [...prev, ...fileURLs]);
  };
  
  const addImageToGallery = (img: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery ?? []), img], // null-safe
    }));
    setNewGalleryImages((prev) => prev.filter((i) => i !== img));
  };
  
  const removeGalleryImage = (index: number) => {
    const updatedGallery = (formData.gallery ?? []).filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: updatedGallery });
  };
  
  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewProfilePhoto(previewUrl);
    }
  };
  
  const applyNewProfilePhoto = () => {
    if (newProfilePhoto) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: newProfilePhoto,
      }));
      setNewProfilePhoto(null);
    }
  };
  

  const fields = [
    { label: "Name", key: "name" },
    { label: "Phone Number", key: "phoneNo" },
    { label: "Optional Email", key: "optionalEmail" },
    { label: "Register ID", key: "registerId" },
    { label: "Specialization", key: "specialization" },
    { label: "MBBS College", key: "mbbsCollege" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 space-y-8">
    <h1 className="text-2xl font-bold text-center text-gray-800">Edit Doctor Profile</h1>
  
    {/* Email - Non-editable */}
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <label className="w-full sm:w-1/3 font-medium text-gray-700">Email:</label>
      <input
        type="text"
        value={formData.email}
        disabled
        className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded"
      />
    </div>
  
    {/* Editable Fields */}
    {fields.map(({ label, key }) => (
      <div key={key} className="flex flex-col sm:flex-row items-center gap-4">
        <label className="w-full sm:w-1/3 font-medium text-gray-700">{label}:</label>
        <input
          type="text"
          value={formData[key]  || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          disabled={!editFields[key]}
          className={`flex-1 px-4 py-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${editFields[key] ? "border-blue-500 bg-white" : "bg-gray-100 border-gray-300 " }`}
        />
        <button
          onClick={() => toggleEdit(key)}
          className={`mt-2 sm:mt-0 px-4 py-2 w-50 sm:w-30 text-white rounded ${editFields[key] ? "bg-green-600" : "bg-blue-600"}`}
        >
          {editFields[key] ? "Save" : "Edit"}
        </button>
      </div>
    ))}
  
    {/* Profile Photo Upload */}
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">Profile Photo:</label>
      {formData.profilePhoto && (
        <img src={formData.profilePhoto} alt="Profile" className="w-32 h-32 object-cover rounded border" />
      )}
      <input type="file" accept="image/*" onChange={handleProfilePhotoChange} />
      {newProfilePhoto && (
        <div className="mt-2">
          <img src={newProfilePhoto} alt="Preview" className="w-32 h-32 object-cover rounded border" />
          <button onClick={applyNewProfilePhoto} className="mt-1 px-3 py-1 bg-green-600 text-white rounded">Apply</button>
        </div>
      )}
    </div>
  
    {/* Degree Section */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">Degrees:</label>
      {formData.degree?.map((deg, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center mb-2 text-center">
          <input
            type="text"
            placeholder="Degree Name"
            value={deg.name || ""}
            onChange={(e) => handleDegreeChange(idx, "name", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="College Name"
            value={deg.college || ""}
            onChange={(e) => handleDegreeChange(idx, "college", e.target.value)}
            className="sm:flex-1 w-full px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Passing Year"
            value={deg.year || ""}
            onChange={(e) => handleDegreeChange(idx, "year", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <button
            onClick={() => removeDegree(idx)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addDegree}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Degree
      </button>
    </div>
  
    {/* Work Section */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">Work Section:</label>
      {formData.work?.map((wk, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center mb-2">
          <input
            type="text"
            placeholder="College Name"
            value={wk.college || ""}
            onChange={(e) => handleWorkChange(idx, "college", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Day: SAT to MON"
            value={wk.day || ""}
            onChange={(e) => handleWorkChange(idx, "day", e.target.value)}
            className="sm:flex-1 w-full px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Time"
            value={wk.time || ""}
            onChange={(e) => handleWorkChange(idx, "time", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <button
            onClick={() => removeWork(idx)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addWork}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Work
      </button>
    </div>
  
    {/* Experience Section */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">Experience:</label>
      {formData.experience?.map((exp, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center mb-2">
          <input
            type="text"
            placeholder="College Name"
            value={exp.college || ""}
            onChange={(e) => handleDegreeChange(idx, "college", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Starting Year"
            value={exp.startingYear || ""}
            onChange={(e) => handleExperienceChange(idx, "startingYear", e.target.value)}
            className="sm:flex-1 w-full px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Ending Year"
            value={exp.endingYear || ""}
            onChange={(e) => handleExperienceChange(idx, "endingYear", e.target.value)}
            className="w-full sm:w-62 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <button
            onClick={() => removeExperience(idx)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Experience
      </button>
    </div>
  
    {/* Chamber Section */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">Chamber Details:</label>
      {formData.chamber?.map((cham, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center mb-2">
          <input
            type="text"
            placeholder="Place"
            value={cham.place || ""}
            onChange={(e) => handleDegreeChange(idx, "place", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Day: SAT to WED"
            value={cham.day || ""}
            onChange={(e) => handleDegreeChange(idx, "day", e.target.value)}
            className="sm:flex-1 w-full px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Time: 7.00pm to 10pm"
            value={cham.time || ""}
            onChange={(e) => handleChamberChange(idx, "time", e.target.value)}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded text-gray-800"
          />
          <button
            onClick={() => removeChamber(idx)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addChamber}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Chamber
      </button>
    </div>
  
    {/* Gallery Section */}
    <div>
  <label className="block font-medium text-gray-700 mb-2">Gallery:</label>
  {(formData.gallery?.length || 0) > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {formData.gallery?.map((img, idx) => (
        <div key={idx} className="relative group">
          <img
            src={img}
            alt={`gallery-${idx}`}
            className="w-full h-32 object-cover rounded border"
          />
          <button
            onClick={() => removeGalleryImage(idx)}
            className="absolute top-1 right-1 px-2 py-1 text-xs bg-red-600 text-white rounded opacity-80 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleGalleryUpload}
    className="mb-4"
  />

  {newGalleryImages.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {newGalleryImages.map((img, idx) => (
        <div key={idx} className="relative">
          <img
            src={img}
            alt={`preview-${idx}`}
            className="w-full h-32 object-cover rounded border"
          />
          <button
            onClick={() => addImageToGallery(img)}
            className="absolute bottom-1 left-1 px-2 py-1 text-xs bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  )}
</div>
  </div>
  
      );
}
