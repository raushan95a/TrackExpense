import { Router } from 'express';
import analyticsRoutes from './analytics.routes.js';
import authRoutes from './auth.routes.js';
import budgetRoutes from './budget.routes.js';
import categoryRoutes from './category.routes.js';
import healthRoutes from './health.routes.js';
import transactionRoutes from './transaction.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
