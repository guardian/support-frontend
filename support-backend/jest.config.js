/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	runner: 'groups',
	testPathIgnorePatterns: ['/node_modules/', 'target'],
	transformIgnorePatterns: ['/node_modules/\\.pnpm/(?!@guardian)'],
	setupFilesAfterEnv: ['<rootDir>/src/test/test-setup.ts'],
};
