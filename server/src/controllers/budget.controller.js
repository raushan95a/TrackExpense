import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import * as budgetService from '../services/budget.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listBudgets = asyncHandler(async (req, res) => {
  const data = await budgetService.listBudgets(req.user.id, req.query.month);
  sendSuccess(res, { data, message: MESSAGES.BUDGETS_FETCHED });
});

export const upsertBudget = asyncHandler(async (req, res) => {
  const { budget, created } = await budgetService.upsertBudget(req.user.id, req.body);
  sendSuccess(res, {
    data: { budget },
    message: created ? MESSAGES.BUDGET_CREATED : MESSAGES.BUDGET_UPDATED,
    statusCode: created ? HTTP_STATUS.CREATED : HTTP_STATUS.OK,
  });
});

export const deleteBudget = asyncHandler(async (req, res) => {
  await budgetService.deleteBudget(req.user.id, req.params.id);
  sendSuccess(res, { message: MESSAGES.BUDGET_DELETED });
});
