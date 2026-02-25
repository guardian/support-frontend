module.exports = {
	testMatch: [
		'**/__tests__/**/*.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
		'!**/__fixtures__/**',
	],
	transform: {
		'.+\\.(js|jsx|ts|tsx)$': './node_modules/babel-jest',
	},
	transformIgnorePatterns: [
		'/node_modules/\\.pnpm/(?!@guardian)',
		'^.+\\.module\\.css$',
	],
	moduleFileExtensions: ['js', 'ts', 'json', 'es6', 'jsx', 'tsx'],
	modulePaths: ['assets'],
	modulePathIgnorePatterns: ['target', 'assets copy'],
	moduleNameMapper: {
		'\\.(css|less)$': '<rootDir>/assets/__mocks__/styleMock.ts',
		'\\.(svg|png|jpg)$': '<rootDir>/assets/__mocks__/imageMock.ts',
		'@modules/product-catalog/(.*)$':
			'@guardian/support-service-lambdas/modules/product-catalog/src/$1',
		'@modules/internationalisation/(.*)$':
			'@guardian/support-service-lambdas/modules/internationalisation/src/$1',
		'@modules/arrayFunctions':
			'@guardian/support-service-lambdas/modules/arrayFunctions',
		'@modules/nullAndUndefined':
			'@guardian/support-service-lambdas/modules/nullAndUndefined',
		'@modules/objectFunctions':
			'@guardian/support-service-lambdas/modules/objectFunctions',
		'@modules/(.*)$': '<rootDir>/../modules/$1',
	},
	setupFilesAfterEnv: ['./jestSetup'],
	verbose: true,
	testEnvironment: 'jest-environment-jsdom-global',
};
