import { ROLES } from '../config/constants.js';
import { Course, Tutor, User } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { buildPaginationMeta, escapeRegExp, resolvePagination } from '../utils/pagination.js';
import { hashPassword } from '../utils/password.js';

const USER_POPULATE = { path: 'user', select: 'fullName email phone avatarUrl isActive createdAt' };

export async function listTutors(query = {}) {
  const { page, limit, skip } = resolvePagination(query);
  const filter = query.includeInactive ? {} : { isActive: true };

  // The searchable fields live on User, so matching users are resolved first.
  if (query.search) {
    const pattern = new RegExp(escapeRegExp(query.search), 'i');
    const userIds = await User.find({
      role: ROLES.TUTOR,
      $or: [{ fullName: pattern }, { email: pattern }],
    }).distinct('_id');
    filter.$or = [{ user: { $in: userIds } }, { specialization: pattern }];
  }

  const [items, total] = await Promise.all([
    Tutor.find(filter).populate(USER_POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Tutor.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getTutorById(id) {
  const tutor = await Tutor.findById(id).populate(USER_POPULATE);
  if (!tutor) throw ApiError.notFound('Tutor not found');
  return tutor;
}

export async function getTutorByUserId(userId) {
  const tutor = await Tutor.findOne({ user: userId }).populate(USER_POPULATE);
  if (!tutor) throw ApiError.notFound('Tutor profile not found');
  return tutor;
}

/** Creates the login and the teaching profile together. */
export async function createTutor({ fullName, email, password, phone = '', ...profile }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({
    fullName,
    email,
    phone,
    role: ROLES.TUTOR,
    password: await hashPassword(password),
  });

  const tutor = await Tutor.create({ ...profile, user: user._id });
  return tutor.populate(USER_POPULATE);
}

export async function updateTutor(id, { fullName, email, phone, ...profile }) {
  const tutor = await Tutor.findById(id);
  if (!tutor) throw ApiError.notFound('Tutor not found');

  const userUpdates = pickDefined({ fullName, email, phone });
  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(tutor.user, userUpdates, { runValidators: true });
  }

  Object.assign(tutor, pickDefined(profile));
  await tutor.save();

  return tutor.populate(USER_POPULATE);
}

/**
 * Soft-deletes the tutor and their login, and unassigns them from any course
 * so the catalogue never points at a tutor who is gone.
 */
export async function deactivateTutor(id) {
  const tutor = await Tutor.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!tutor) throw ApiError.notFound('Tutor not found');

  await Promise.all([
    User.findByIdAndUpdate(tutor.user, { isActive: false }),
    Course.updateMany({ tutor: tutor._id }, { tutor: null }),
  ]);

  return tutor;
}

function pickDefined(source) {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined));
}
