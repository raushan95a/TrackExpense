import { HTTP_STATUS } from '../constants/httpStatus.js';

/** Sends the standard success envelope: { success, data, message }. */
export const sendSuccess = (res, { data = null, message = '', statusCode = HTTP_STATUS.OK } = {}) =>
  res.status(statusCode).json({ success: true, data, message });
