import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

// Contact message interface with status tracking
interface Contact {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  address: string;
  phoneNo: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

// Doctor-specific interfaces
interface Degree {
  name: string;
  college: string;
  year: string;
}

interface Education {
  year: string;
  examName: string;
  institute: string;
}

interface Work {
  role: string;
  college: string;
  day: string;
  time: string;
  collegePhoneNumber: string;
}

interface Experience {
  role: string;
  college: string;
  startingYear: string;
  endingYear: string;
}

interface Chamber {
  place: string;
  day: string;
  time: string;
  bookContact: string;
}

// Main User interface
export interface IUser extends Document {
  // Authentication
  name: string;
  email: string;
  phoneNo: string;
  password: string;
  isVerified: boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  getVerificationToken(): string;

  // Profile
  optionalEmail?: string;
  registerId?: string;
  specialization?: string;
  profilePhoto?: string;
  ContactNo?: string;
  bio?: string;
  aboutPicture?: string;
  
  // Social
  fbLink?: string;
  instagram?: string;
  Linkedin?: string;
  youTubeLink?: string;
  gallery?: string[];
  
  // Professional
  degrees?: Degree[];
  education?: Education[];
  mbbsCollege?: string;
  work?: Work[];
  experience?: Experience[];
  chamber?: Chamber[];
  
  // Appointments
  contacts?: Contact[];
}

const ContactSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  address: { 
    type: String, 
    trim: true,
    default: ""
  },
  phoneNo: { 
    type: String, 
    trim: true,
    default: ""
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true
  },
  status: { 
    type: String, 
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: 'Status must be either pending, accepted or rejected'
    }, 
    default: 'pending',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true
  },
  updatedAt: { 
    type: Date 
  }
}, {
  _id: true,
  versionKey: false
});

const UserSchema: Schema<IUser> = new Schema(
  {
    // Authentication
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phoneNo: { 
      type: String, 
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      select: false
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verifyToken: { 
      type: String,
      select: false
    },
    verifyTokenExpire: { 
      type: Date,
      select: false 
    },

    // Profile
    optionalEmail: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true,
      lowercase: true
    },
    registerId: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true
    },
    bio: { 
      type: String, 
      trim: true 
    },
    aboutPicture: { 
      type: String 
    },
    ContactNo: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true
    },
    specialization: { 
      type: String, 
      trim: true 
    },
    profilePhoto: { 
      type: String 
    },

    // Social
    Linkedin: { 
      type: String, 
      trim: true 
    },
    fbLink: { 
      type: String, 
      trim: true 
    },
    instagram: { 
      type: String, 
      trim: true 
    },
    youTubeLink: { 
      type: String, 
      trim: true 
    },
    gallery: { 
      type: [String], 
      default: [] 
    },

    // Professional
    degrees: {
      type: [{
        name: { type: String, trim: true },
        college: { type: String, trim: true },
        year: { type: String, trim: true }
      }],
      default: []
    },

    education: {
      type: [{
        year: { type: String, trim: true },
        examName: { type: String, trim: true },
        institute: { type: String, trim: true }
      }],
      default: []
    },

    mbbsCollege: { 
      type: String, 
      trim: true 
    },

    work: {
      type: [{
        role: { type: String, trim: true },
        college: { type: String, trim: true },
        day: { type: String, trim: true },
        time: { type: String, trim: true },
        collegePhoneNumber: { type: String, trim: true }
      }],
      default: []
    },

    experience: {
      type: [{
        role: { type: String, trim: true },
        college: { type: String, trim: true },
        startingYear: { type: String, trim: true },
        endingYear: { type: String, trim: true }
      }],
      default: []
    },

    chamber: {
      type: [{
        place: { type: String, trim: true },
        day: { type: String, trim: true },
        time: { type: String, trim: true },
        bookContact: { type: String, trim: true }
      }],
      default: []
    },

    // Appointments
    contacts: {
      type: [ContactSchema],
      default: []
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.verifyToken;
        delete ret.verifyTokenExpire;
        return ret;
      }
    },
    versionKey: false
  }
);

// Generate Verification Token Method
UserSchema.methods.getVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verifyToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  return verificationToken;
};

// Indexes
UserSchema.index({ 'contacts.status': 1 });

// Add text indexes for search functionality
UserSchema.index({
  name: 'text',
  specialization: 'text',
  'degrees.name': 'text',
  'education.examName': 'text'
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);