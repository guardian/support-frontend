/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	runner: 'groups',
	testPathIgnorePatterns: ['/node_modules/', 'target'],
	transformIgnorePatterns: ['/node_modules/\\.pnpm/(?!@guardian)'],
	moduleNameMapper: {
		'@modules/internationalisation/(.*)$':
			'<rootDir>/../modules/internationalisation/$1',
		'@modules/(.*)/(.*)$':
			'@guardian/support-service-lambdas/modules/$1/src/$2',
		'@modules/(.*)$': '@guardian/support-service-lambdas/modules/$1',
	},
};
