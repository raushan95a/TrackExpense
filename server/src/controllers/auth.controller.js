import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  sendSuccess(res, { data, message: MESSAGES.REGISTERED, statusCode: HTTP_STATUS.CREATED });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  sendSuccess(res, { data, message: MESSAGES.LOGGED_IN });
});

export const getMe = (req, res) =>
  sendSuccess(res, { data: { user: req.user }, message: MESSAGES.PROFILE_FETCHED });

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  sendSuccess(res, { data: { user }, message: MESSAGES.PROFILE_UPDATED });
});

export const changePassword = asyncHandler(async (req, res) => {
  const data = await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, { data, message: MESSAGES.PASSWORD_CHANGED });
});
