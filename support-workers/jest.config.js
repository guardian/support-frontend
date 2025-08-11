/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	runner: 'groups',
	testPathIgnorePatterns: ['/node_modules/', 'target'],
	transformIgnorePatterns: ['/node_modules/\\.pnpm/(?!@guardian)'],
	moduleNameMapper: {
		// Modules directory in support-frontend
		'@modules/(product|internationalisation)/(.*)$':
			'<rootDir>/../modules/$1/$2',
		// Modules directory in support-service-lambdas
		'@modules/(.*)/(.*)/(.*)$':
			'@guardian/support-service-lambdas/modules/$1/src/$2/$3',
		'@modules/(.*)/(.*)$':
			'@guardian/support-service-lambdas/modules/$1/src/$2',
		'@modules/(.*)$': '@guardian/support-service-lambdas/modules/$1',
	},
};
