// Runs before every test file: provides safe, non-secret config for tests.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker_test';
process.env.CLIENT_URL = 'http://localhost:5173';
