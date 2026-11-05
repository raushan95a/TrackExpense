import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import * as transactionService from '../services/transaction.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toIsoDate } from '../utils/date.js';

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.user.id, req.body);
  sendSuccess(res, {
    data: { transaction },
    message: MESSAGES.TRANSACTION_CREATED,
    statusCode: HTTP_STATUS.CREATED,
  });
});

export const listTransactions = asyncHandler(async (req, res) => {
  const data = await transactionService.listTransactions(req.user.id, req.query);
  sendSuccess(res, { data, message: MESSAGES.TRANSACTIONS_FETCHED });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransaction(req.user.id, req.params.id);
  sendSuccess(res, { data: { transaction }, message: MESSAGES.TRANSACTION_FETCHED });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(
    req.user.id,
    req.params.id,
    req.body,
  );
  sendSuccess(res, { data: { transaction }, message: MESSAGES.TRANSACTION_UPDATED });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.user.id, req.params.id);
  sendSuccess(res, { message: MESSAGES.TRANSACTION_DELETED });
});

export const exportTransactions = asyncHandler(async (req, res) => {
  const csv = await transactionService.exportTransactionsCsv(req.user.id, req.query);
  res
    .status(HTTP_STATUS.OK)
    .type('text/csv; charset=utf-8')
    .attachment(`transactions-${toIsoDate(new Date())}.csv`)
    .send(csv);
});
