import { ROLES } from '../config/constants.js';
import { Student, Tutor, User } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { comparePassword, hashPassword } from '../utils/password.js';

/**
 * Creates the User plus the role-specific profile that belongs with it.
 * Public signup is always a student; admins create tutors and other admins.
 */
export async function registerUser({ fullName, email, password, phone = '', role = ROLES.STUDENT }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({
    fullName,
    email,
    phone,
    role,
    password: await hashPassword(password),
  });

  await createRoleProfile(user);

  return user;
}

/** Ensures the Tutor/Student document matching a user's role exists. */
export async function createRoleProfile(user) {
  if (user.role === ROLES.TUTOR) {
    return Tutor.findOneAndUpdate(
      { user: user._id },
      { $setOnInsert: { user: user._id } },
      { upsert: true, new: true },
    );
  }
  if (user.role === ROLES.STUDENT) {
    return Student.findOneAndUpdate(
      { user: user._id },
      { $setOnInsert: { user: user._id } },
      { upsert: true, new: true },
    );
  }
  return null;
}

export async function authenticate({ email, password }) {
  // `password` is `select: false` on the schema, so ask for it explicitly.
  const user = await User.findOne({ email }).select('+password');

  // Same message for both branches so the endpoint cannot be used to probe
  // which email addresses are registered.
  if (!user) throw ApiError.unauthorized('Email or password is incorrect');
  if (!user.isActive) throw ApiError.forbidden('This account has been deactivated');

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) throw ApiError.unauthorized('Email or password is incorrect');

  user.password = undefined;
  return user;
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const profile = await loadRoleProfile(user);
  return { user, profile };
}

export async function loadRoleProfile(user) {
  if (user.role === ROLES.TUTOR) return Tutor.findOne({ user: user._id });
  if (user.role === ROLES.STUDENT) return Student.findOne({ user: user._id });
  return null;
}

export async function updateProfile(userId, updates) {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  const matches = await comparePassword(currentPassword, user.password);
  if (!matches) throw ApiError.badRequest('Current password is incorrect');

  user.password = await hashPassword(newPassword);
  await user.save();
}
