import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTransactionRules,
  exportTransactionsRules,
  listTransactionsRules,
  transactionIdRules,
  updateTransactionRules,
} from '../validators/transaction.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listTransactionsRules), transactionController.listTransactions)
  .post(validate(createTransactionRules), transactionController.createTransaction);

// Must be declared before /:id so "export" is not treated as an id.
router.get('/export', validate(exportTransactionsRules), transactionController.exportTransactions);

router
  .route('/:id')
  .get(validate(transactionIdRules), transactionController.getTransaction)
  .put(validate(updateTransactionRules), transactionController.updateTransaction)
  .delete(validate(transactionIdRules), transactionController.deleteTransaction);

export default router;
