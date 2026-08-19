/** Every role the platform understands. Stored on the User document. */
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  TUTOR: 'tutor',
  STUDENT: 'student',
});

export const ROLE_VALUES = Object.values(ROLES);

/** Lifecycle of a student's place on a course. */
export const ENROLLMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const ENROLLMENT_STATUS_VALUES = Object.values(ENROLLMENT_STATUS);

export const COURSE_LEVELS = Object.freeze({
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
});

export const COURSE_LEVEL_VALUES = Object.values(COURSE_LEVELS);

export const AUTH_COOKIE_NAME = 'it_center_token';

/** Seven days, expressed in seconds and in the string form jsonwebtoken wants. */
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
export const TOKEN_TTL = '7d';

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
});
