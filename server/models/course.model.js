import mongoose from 'mongoose';

import { COURSE_LEVELS, COURSE_LEVEL_VALUES } from '../config/constants.js';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    imageUrl: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0, default: 0 },
    level: { type: String, enum: COURSE_LEVEL_VALUES, default: COURSE_LEVELS.BEGINNER, index: true },
    category: { type: String, trim: true, default: '', index: true },
    durationWeeks: { type: Number, min: 1, max: 104, default: 8 },
    // Nullable so an admin can publish a course before assigning a tutor.
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', default: null, index: true },
    capacity: { type: Number, min: 1, max: 500, default: 30 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

courseSchema.index({ title: 'text', description: 'text' });

courseSchema.set('toJSON', { virtuals: true });

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
