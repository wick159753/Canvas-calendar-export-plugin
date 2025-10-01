/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    // If you have CSS modules or other assets, you can mock them here
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          // Tell ts-jest to process JSX
          jsx: 'react-jsx',
        },
      },
    ],
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
