import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  deleteBudgetRules,
  listBudgetsRules,
  upsertBudgetRules,
} from '../validators/budget.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listBudgetsRules), budgetController.listBudgets)
  .post(validate(upsertBudgetRules), budgetController.upsertBudget);

router.delete('/:id', validate(deleteBudgetRules), budgetController.deleteBudget);

export default router;
