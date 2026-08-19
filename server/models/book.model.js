import mongoose from 'mongoose';

/** A library item. `fileUrl` points at the downloadable copy when one exists. */
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    author: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    imageUrl: { type: String, trim: true, default: '' },
    fileUrl: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '', index: true },
    publishedYear: { type: Number, min: 1400, max: 2200, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

bookSchema.index({ title: 'text', description: 'text', author: 'text' });

bookSchema.set('toJSON', { virtuals: true });

export const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
