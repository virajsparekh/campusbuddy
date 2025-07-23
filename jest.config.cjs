// Jest configuration for ES modules
module.exports = {
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
  ]
}; 