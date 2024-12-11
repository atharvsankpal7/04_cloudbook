require('dotenv').config();

// Set test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/college-appointments-test';
process.env.NODE_ENV = 'test';