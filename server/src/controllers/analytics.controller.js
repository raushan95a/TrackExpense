import { MESSAGES } from '../constants/messages.js';
import * as analyticsService from '../services/analytics.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummary(req.user.id, req.query.month);
  sendSuccess(res, { data, message: MESSAGES.SUMMARY_FETCHED });
});

export const getByCategory = asyncHandler(async (req, res) => {
  const data = await analyticsService.getByCategory(req.user.id, req.query);
  sendSuccess(res, { data, message: MESSAGES.CATEGORY_BREAKDOWN_FETCHED });
});

export const getMonthly = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthly(req.user.id, req.query.year);
  sendSuccess(res, { data, message: MESSAGES.MONTHLY_TRENDS_FETCHED });
});
