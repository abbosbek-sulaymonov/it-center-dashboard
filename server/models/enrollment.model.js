import mongoose from 'mongoose';

import { ENROLLMENT_STATUS, ENROLLMENT_STATUS_VALUES } from '../config/constants.js';

/** Join document between a Student and a Course. */
const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    status: {
      type: String,
      enum: ENROLLMENT_STATUS_VALUES,
      default: ENROLLMENT_STATUS.PENDING,
      index: true,
    },
    // Percentage the student has completed, kept simple for the MVP.
    progress: { type: Number, min: 0, max: 100, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// A student can hold only one enrollment per course.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

enrollmentSchema.set('toJSON', { virtuals: true });

export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
