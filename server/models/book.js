// server/models/book.js
import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
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
    ebookUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    author: {
      type: String,
      default: '',
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
bookSchema.index({ name: 'text', description: 'text' });

export default model('Book', bookSchema);
