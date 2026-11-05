import { MESSAGES } from '../constants/messages.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';

const withToken = (user) => ({ user, token: generateToken(user.id) });

export const register = async ({ name, email, password }) => {
  if (await User.exists({ email })) {
    throw ApiError.conflict(MESSAGES.EMAIL_IN_USE, [
      { field: 'email', msg: MESSAGES.EMAIL_IN_USE },
    ]);
  }
  const user = await User.create({ name, email, password });
  return withToken(user);
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  // Same error for unknown email and wrong password to avoid account enumeration.
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS);
  }
  return withToken(user);
};

/** Loads a user for the auth middleware; includes passwordChangedAt for token checks. */
export const findUserForAuth = (userId) => User.findById(userId).select('+passwordChangedAt');

export const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!user) throw ApiError.notFound(MESSAGES.USER_NOT_FOUND);
  return user;
};

/** Changes the password and returns a fresh token (older tokens become invalid). */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound(MESSAGES.USER_NOT_FOUND);
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest(MESSAGES.WRONG_CURRENT_PASSWORD, [
      { field: 'currentPassword', msg: MESSAGES.WRONG_CURRENT_PASSWORD },
    ]);
  }
  user.password = newPassword;
  await user.save();
  return { token: generateToken(user.id) };
};
