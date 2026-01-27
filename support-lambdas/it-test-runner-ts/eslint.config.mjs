import rootConfig from '../../eslint.config.mjs';

export default [
	...rootConfig,
	{
		ignores: ['node_modules', 'dist', 'target'],
	},
	{
		files: ['src/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
		},
	},
];
