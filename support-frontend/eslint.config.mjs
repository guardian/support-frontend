import guardian from '@guardian/eslint-config';

export default [
	...guardian.configs.recommended,
	...guardian.configs.jest,
	...guardian.configs.react,
	...guardian.configs.storybook,
	{
		rules: {
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'react/no-unknown-property': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/prefer-promise-reject-errors': 'off',
			'@typescript-eslint/only-throw-error': 'off',
		},
		ignores: [
			'public/**/*',
			'target/**/*',
			'tools/**/*.js',
			'coverage/',
			'storybook-static/',
			'scripts/*.js',
		],
	},
];
