import { Book } from '@server/models';

// Get all books with pagination
export async function getBooks(req, res) {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find({ isActive: true }).limit(parseInt(limit)).skip(skip).sort({ createdAt: -1 });

    const total = await Book.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        data: books,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
}

// Get single book by ID
export async function getBookById(req, res) {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message,
    });
  }
}

// Search books by name
export async function searchBooks(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const books = await Book.find({
      isActive: true,
      $or: [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }],
    }).limit(20);

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching books',
      error: error.message,
    });
  }
}

// Create new book (admin only)
export async function createBook(req, res) {
  try {
    const bookData = req.body;

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message,
    });
  }
}

// Update book (admin only)
export async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message,
    });
  }
}

// Delete book (admin only)
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message,
    });
  }
}
