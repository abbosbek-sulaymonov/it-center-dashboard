import mongoose from 'mongoose';

/** Learner profile attached to a User whose role is `student`. */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // Free-form cohort label, e.g. "Frontend-24A".
    group: { type: String, trim: true, default: '' },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

studentSchema.set('toJSON', { virtuals: true });

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
