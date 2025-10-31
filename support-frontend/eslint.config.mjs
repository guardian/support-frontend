import * as emotion from '@emotion/eslint-plugin';
import guardian from '@guardian/eslint-config';

export default [
	...guardian.configs.recommended,
	...guardian.configs.jest,
	...guardian.configs.react,
	...guardian.configs.storybook,
	{
		files: ['**/*.tsx', '**/*.ts'],
		plugins: { '@emotion': emotion },
		rules: {
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'react/no-unknown-property': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/prefer-promise-reject-errors': 'off',
			'@typescript-eslint/only-throw-error': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					ignoreRestSiblings: true,
					caughtErrors: 'none',
				},
			],
			'@emotion/pkg-renaming': 'error',
			'react/function-component-definition': [
				1,
				{
					namedComponents: 'function-declaration',
					unnamedComponents: 'function-expression',
				},
			],
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
