// server/models/course.js
import { Schema, model } from 'mongoose';

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    instructor: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    category: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Add text index for search functionality
courseSchema.index({ name: 'text', description: 'text' });

export default model('Course', courseSchema);
