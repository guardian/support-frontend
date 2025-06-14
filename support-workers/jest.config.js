/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	runner: 'groups',
	testPathIgnorePatterns: ['/node_modules/', 'target'],
	moduleNameMapper: {
		'@modules/(.*)$': '<rootDir>/../modules/$1',
	},
};
