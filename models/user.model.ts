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

  // New fields
  registerId?: string;
  specialization?: string;
  profilePhoto?: string;
  galleryPhotos?: string[];
  degree?: string;
  mbbsCollege?: string;
  profession?: {
    location: string;
    days: string[];
    time: string;
  };
  chamber?: {
    location: string;
    days: string[];
    time: string;
  };
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
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
    default: false
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpire: {
    type: Date
  },

  // Doctor-specific fields
  registerId: {
    type: String,
  },
  specialization: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  galleryPhotos: [
    {
      type: String,
    }
  ],
  degree: {
    type: String,
  },
  mbbsCollege: {
    type: String,
  },
  profession: {
    location: String,
    days: [String],
    time: String,
  },
  chamber: {
    location: String,
    days: [String],
    time: String,
  }
});

UserSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.verifyToken = crypto.createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000);
  return verificationToken;
}

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
