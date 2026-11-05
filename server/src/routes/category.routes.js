import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createCategoryRules,
  deleteCategoryRules,
  listCategoriesRules,
  updateCategoryRules,
} from '../validators/category.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listCategoriesRules), categoryController.listCategories)
  .post(validate(createCategoryRules), categoryController.createCategory);

router
  .route('/:id')
  .put(validate(updateCategoryRules), categoryController.updateCategory)
  .delete(validate(deleteCategoryRules), categoryController.deleteCategory);

export default router;
