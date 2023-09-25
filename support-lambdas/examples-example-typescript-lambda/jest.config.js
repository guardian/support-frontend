module.exports = {
	verbose: true,
	testEnvironment: 'node',
	projects: [
		{
			displayName: 'cdk',
			transform: {
				'^.+\\.tsx?$': 'ts-jest',
			},
			setupFilesAfterEnv: ['<rootDir>/packages/cdk/jest.setup.js'],
			testMatch: ['<rootDir>/packages/cdk/**/*.test.ts'],
		},
		{
			displayName: 'lambda',
			transform: {
				'^.+\\.tsx?$': 'ts-jest',
			},
			testMatch: ['<rootDir>/packages/lambda/**/*.test.ts'],
			setupFiles: ['dotenv/config'],
		},
	],
};
