import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

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
  degree?: Degree[];
  mbbsCollege?: string;
  work?: Work[];
  experience?: Experience[];
  chamber?: Chamber[];
}

interface Degree {
  name: string;
  college: string;
  year: string;
}

interface Work {
  college: string;
  day: string;
  time: string;
}

interface Experience {
  college: string;
  startingYear: string;
  endingYear: string;
}

interface Chamber {
  place: string;
  day: string;
  time: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpire: {
      type: Date,
    },

    // Doctor-specific fields
    optionalEmail: {
      type: String,
      required: true,
      unique: true,
    },
    registerId: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      required: true,
     
    },
    gallery: [
      {
        type: String,
      },
    ],
    degree: [
      {
        name: {  type: String,
          required: true, },
        college: { type: String,
          required: true, },
        year: { type: String,
          required: true, },
      },
    ],
    mbbsCollege: {
      type: String,
      required: true,
    },
    work: [
      {
        college: {  type: String,
          required: true, },
        day: {  type: String,
          required: true, },
        time: {  type: String,
          required: true, },
      },
    ],
    experience: [
      {
        college: {  type: String,
          required: true, },
        startingYear: {  type: String,
          required: true, },
        endingYear: {  type: String,
          required: true, },
      },
    ],
    chamber: [
      {
        place: { type: String },
        day: { type: String },
        time: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Verification Token Method
UserSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verifyToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  return verificationToken;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
