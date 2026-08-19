import mongoose from 'mongoose';

/** Teaching profile attached to a User whose role is `tutor`. */
const tutorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    specialization: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '', maxlength: 2000 },
    experienceYears: { type: Number, min: 0, max: 60, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

tutorSchema.set('toJSON', { virtuals: true });

export const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);
