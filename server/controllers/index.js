import { Book, Course } from '@server/models';

// Combined search for both courses and books
export async function globalSearch(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchQuery = {
      isActive: true,
      $or: [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }],
    };

    const [courses, books] = await Promise.all([Course.find(searchQuery).limit(10), Book.find(searchQuery).limit(10)]);

    res.status(200).json({
      success: true,
      data: {
        courses,
        books,
        total: courses.length + books.length,
      },
    });
  } catch (error) {
    console.error('Error in global search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message,
    });
  }
}
