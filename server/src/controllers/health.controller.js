import { MESSAGES } from '../constants/messages.js';
import { getHealthStatus } from '../services/health.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const checkHealth = (req, res) =>
  sendSuccess(res, { data: getHealthStatus(), message: MESSAGES.HEALTH_OK });
