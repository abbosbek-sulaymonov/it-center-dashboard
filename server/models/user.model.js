import mongoose from 'mongoose';

import { ROLES, ROLE_VALUES } from '../config/constants.js';

/**
 * Authentication identity. Domain detail lives on the Tutor/Student profile
 * documents that point back here, so a person keeps one login across roles.
 */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Always a bcrypt hash. Excluded from queries unless explicitly selected.
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLE_VALUES, default: ROLES.STUDENT, index: true },
    phone: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
