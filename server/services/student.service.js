import { ROLES } from '../config/constants.js';
import { Enrollment, Student, User } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { buildPaginationMeta, escapeRegExp, resolvePagination } from '../utils/pagination.js';
import { hashPassword } from '../utils/password.js';

const USER_POPULATE = { path: 'user', select: 'fullName email phone avatarUrl isActive createdAt' };

export async function listStudents(query = {}) {
  const { page, limit, skip } = resolvePagination(query);
  const filter = query.includeInactive ? {} : { isActive: true };
  if (query.group) filter.group = query.group;

  if (query.search) {
    const pattern = new RegExp(escapeRegExp(query.search), 'i');
    const userIds = await User.find({
      role: ROLES.STUDENT,
      $or: [{ fullName: pattern }, { email: pattern }],
    }).distinct('_id');
    filter.$or = [{ user: { $in: userIds } }, { group: pattern }];
  }

  const [items, total] = await Promise.all([
    Student.find(filter).populate(USER_POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getStudentById(id) {
  const student = await Student.findById(id).populate(USER_POPULATE);
  if (!student) throw ApiError.notFound('Student not found');
  return student;
}

export async function getStudentByUserId(userId) {
  const student = await Student.findOne({ user: userId }).populate(USER_POPULATE);
  if (!student) throw ApiError.notFound('Student profile not found');
  return student;
}

export async function createStudent({ fullName, email, password, phone = '', ...profile }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({
    fullName,
    email,
    phone,
    role: ROLES.STUDENT,
    password: await hashPassword(password),
  });

  const student = await Student.create({ ...profile, user: user._id });
  return student.populate(USER_POPULATE);
}

export async function updateStudent(id, { fullName, email, phone, ...profile }) {
  const student = await Student.findById(id);
  if (!student) throw ApiError.notFound('Student not found');

  const userUpdates = pickDefined({ fullName, email, phone });
  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(student.user, userUpdates, { runValidators: true });
  }

  Object.assign(student, pickDefined(profile));
  await student.save();

  return student.populate(USER_POPULATE);
}

export async function deactivateStudent(id) {
  const student = await Student.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!student) throw ApiError.notFound('Student not found');

  await User.findByIdAndUpdate(student.user, { isActive: false });
  return student;
}

export async function listGroups() {
  return Student.distinct('group', { isActive: true, group: { $ne: '' } });
}

/** Students holding an enrollment on any of the given courses. */
export async function listStudentsForCourses(courseIds) {
  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate({ path: 'student', populate: USER_POPULATE })
    .populate({ path: 'course', select: 'title' })
    .sort({ createdAt: -1 });

  return enrollments.filter((enrollment) => enrollment.student);
}

function pickDefined(source) {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined));
}
