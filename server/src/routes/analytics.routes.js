import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { byCategoryRules, monthlyRules, summaryRules } from '../validators/analytics.validator.js';

const router = Router();

router.use(protect);

router.get('/summary', validate(summaryRules), analyticsController.getSummary);
router.get('/by-category', validate(byCategoryRules), analyticsController.getByCategory);
router.get('/monthly', validate(monthlyRules), analyticsController.getMonthly);

export default router;
