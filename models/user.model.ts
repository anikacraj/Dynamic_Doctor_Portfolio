import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";
import { Degree, Work, Experience, Chamber } from "@/types/doctor";


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
    gallery: [{ type: String }],
    degree: [
      {
        name: { type: String, required: false },
        college: { type: String, required: false },
        year: { type: String, required: false },
      },
    ],
    mbbsCollege: { type: String, required: false },
    work: [
      {
        college: { type: String, required: false },
        day: { type: String, required: false },
        time: { type: String, required: false },
      },
    ],
    experience: [
      {
        college: { type: String, required: false },
        startingYear: { type: String, required: false },
        endingYear: { type: String, required: false },
      },
    ],
    chamber: [
      {
        place: { type: String, required: false },
        day: { type: String, required: false },
        time: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

// Generate Verification Token
UserSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verifyToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  return verificationToken;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
