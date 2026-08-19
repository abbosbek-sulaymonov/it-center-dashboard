import { Course } from '@server/models';

// Get all courses with pagination
export async function getCourses(req, res) {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find({ isActive: true }).limit(parseInt(limit)).skip(skip).sort({ createdAt: -1 });

    const total = await Course.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        data: courses,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
}

// Get single course by ID
export async function getCourseById(req, res) {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message,
    });
  }
}

// Search courses by name
export async function searchCourses(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const courses = await Course.find({
      isActive: true,
      $or: [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }],
    }).limit(20);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching courses',
      error: error.message,
    });
  }
}

// Create new course (admin only)
export async function createCourse(req, res) {
  try {
    const courseData = req.body;

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
    });
  }
}

// Update course (admin only)
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
}

// Delete course (admin only)
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message,
    });
  }
}
