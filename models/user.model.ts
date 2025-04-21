import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";
import { Degree, Work, Experience, Chamber, Education } from "@/types/doctor";

// Contact message interface
interface Contact {
  name: string;
  email: string;
  address: string;
  phoneNo: string;
  message: string;
  createdAt?: Date;
}

// Main User interface
export interface IUser extends Document {
  name: string;
  email: string;
  phoneNo: string;
  password: string;
  isVerified: boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  getVerificationToken(): string;

  optionalEmail?: string;
  registerId?: string;
  specialization?: string;
  profilePhoto?: string;

  ContactNo?: string;
  bio?: string;
  aboutPicture?: string;
  fbLink?: string;
  instagram?: string;
  Linkedin?: string;
  youTubeLink?: string;

  gallery?: string[];
  degrees?: Degree[];
  education?: Education[]; // ✅ changed from EduCation
  mbbsCollege?: string;
  work?: Work[];
  experience?: Experience[];
  chamber?: Chamber[];
  contacts?: Contact[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpire: { type: Date },

    optionalEmail: { type: String, required: false, unique: true, sparse: true },
    registerId: { type: String, required: false, unique: true, sparse: true },
    bio: { type: String, required: false },
    aboutPicture: { type: String, required: false },
    
    specialization: { type: String, required: false },
    profilePhoto: { type: String, required: false },
    gallery: { type: [String], default: [] },




    
    degrees: {
      type: [
        {
          name: { type: String },
          college: { type: String },
          year: { type: String },
        },
      ],
      default: [],
    },

    education: { // ✅ fixed name
      type: [
        {
          year: { type: String },
          examName: { type: String },
          institute: { type: String },
        },
      ],
      default: [],
    },

    mbbsCollege: { type: String, required: false },

    work: {
      type: [
        {
          role: { type: String, required: false }, // ✅ added
          college: { type: String, required: false },
          day: { type: String, required: false },
          time: { type: String, required: false },
          collegePhoneNumber: { type: String, required: false }, // ✅ added
        },
      ],
      default: [],
    },

    experience: {
      type: [
        {
          role: { type: String, required: false }, // ✅ added
          college: { type: String, required: false },
          startingYear: { type: String, required: false },
          endingYear: { type: String, required: false },
        },
      ],
      default: [],
    },

    chamber: {
      type: [
        {
          place: { type: String, required: false },
          day: { type: String, required: false },
          time: { type: String, required: false },
          bookContact: { type: String, required: false }, // ✅ added
        },
      ],
      default: [],
    },

    contacts: {
      type: [
        {
          name: { type: String, required: false },
          email: { type: String, required: false },
          address: { type: String, required: false },
          phoneNo: { type: String, required: false },
          message: { type: String, required: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ Generate Verification Token Method
UserSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verifyToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  return verificationToken;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
