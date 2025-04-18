import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";
import { Degree, Work, Experience, Chamber } from "@/types/doctor";

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
  gallery?: string[];
  degrees?: Degree[];
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
    

    mbbsCollege: { type: String, required: false },

    work: {
      type: [
        {
          college: { type: String, required: false },
          day: { type: String, required: false },
          time: { type: String, required: false },
        },
      ],
      default: [],
    },

    experience: {
      type: [
        {
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
  this.verifyToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  return verificationToken;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
