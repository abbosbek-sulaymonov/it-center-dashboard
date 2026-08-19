export const ROLES = Object.freeze({
  ADMIN: 'admin',
  TUTOR: 'tutor',
  STUDENT: 'student',
});

export const ENROLLMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

/** antd Tag colours, keyed by enrollment status. */
export const ENROLLMENT_STATUS_COLOR = Object.freeze({
  pending: 'gold',
  active: 'blue',
  completed: 'green',
  cancelled: 'default',
});

export const COURSE_LEVELS = Object.freeze(['beginner', 'intermediate', 'advanced']);

export const COURSE_LEVEL_COLOR = Object.freeze({
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'volcano',
});
