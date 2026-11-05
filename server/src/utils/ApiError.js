import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Operational error carrying an HTTP status and optional field errors.
 * Thrown from services/controllers and rendered by the error middleware.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {{field: string, msg: string}[]} [errors]
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message) {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message) {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message, errors) {
    return new ApiError(HTTP_STATUS.CONFLICT, message, errors);
  }
}
