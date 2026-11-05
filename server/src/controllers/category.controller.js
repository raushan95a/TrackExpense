import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import * as categoryService from '../services/category.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(req.user.id, req.query);
  sendSuccess(res, { data: { categories }, message: MESSAGES.CATEGORIES_FETCHED });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.user.id, req.body);
  sendSuccess(res, {
    data: { category },
    message: MESSAGES.CATEGORY_CREATED,
    statusCode: HTTP_STATUS.CREATED,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.user.id, req.params.id, req.body);
  sendSuccess(res, { data: { category }, message: MESSAGES.CATEGORY_UPDATED });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.user.id, req.params.id);
  sendSuccess(res, { message: MESSAGES.CATEGORY_DELETED });
});
