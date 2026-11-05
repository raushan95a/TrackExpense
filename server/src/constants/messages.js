export const MESSAGES = Object.freeze({
  HEALTH_OK: 'Service is healthy',
  ROUTE_NOT_FOUND: 'Route not found',
  INTERNAL_ERROR: 'Something went wrong',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_ID: 'Invalid resource id',
  DUPLICATE_KEY: 'Resource already exists',
  INVALID_JSON: 'Malformed JSON body',
  PAYLOAD_TOO_LARGE: 'Request body too large',
  CORS_BLOCKED: 'Origin not allowed by CORS',
  UNAUTHORIZED: 'Not authorised',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',

  // Auth
  REGISTERED: 'Account created',
  LOGGED_IN: 'Logged in',
  PROFILE_FETCHED: 'Profile fetched',
  PROFILE_UPDATED: 'Profile updated',
  PASSWORD_CHANGED: 'Password changed',
  EMAIL_IN_USE: 'Email is already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  WRONG_CURRENT_PASSWORD: 'Current password is incorrect',
  TOKEN_MISSING: 'Authentication token missing',
  TOKEN_INVALID: 'Invalid or expired token',
  USER_NOT_FOUND: 'User not found',

  // Categories
  CATEGORIES_FETCHED: 'Categories fetched',
  CATEGORY_CREATED: 'Category created',
  CATEGORY_UPDATED: 'Category updated',
  CATEGORY_DELETED: 'Category deleted',
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_EXISTS: 'A category with this name and type already exists',
  CATEGORY_DEFAULT_READONLY: 'Default categories cannot be modified',
  CATEGORY_IN_USE: 'Category is used by existing transactions',
  CATEGORY_TYPE_LOCKED: 'Category type cannot change while it has transactions or budgets',
  CATEGORY_TYPE_MISMATCH: 'Category type does not match transaction type',

  // Transactions
  TRANSACTIONS_FETCHED: 'Transactions fetched',
  TRANSACTION_FETCHED: 'Transaction fetched',
  TRANSACTION_CREATED: 'Transaction created',
  TRANSACTION_UPDATED: 'Transaction updated',
  TRANSACTION_DELETED: 'Transaction deleted',
  TRANSACTION_NOT_FOUND: 'Transaction not found',

  // Analytics
  SUMMARY_FETCHED: 'Summary fetched',
  CATEGORY_BREAKDOWN_FETCHED: 'Category breakdown fetched',
  MONTHLY_TRENDS_FETCHED: 'Monthly trends fetched',

  // Budgets
  BUDGETS_FETCHED: 'Budgets fetched',
  BUDGET_CREATED: 'Budget created',
  BUDGET_UPDATED: 'Budget updated',
  BUDGET_DELETED: 'Budget deleted',
  BUDGET_NOT_FOUND: 'Budget not found',
  BUDGET_EXPENSE_ONLY: 'Budgets can only be set on expense categories',
});
