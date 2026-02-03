module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.{js,ts}'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/referencia/',
    '/docs/',
    '/dist/',
    '/.expo/',
    '/.vercel/',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testTimeout: 10000,
};