module.exports = {
	extends: ['plugin:storybook/recommended'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			// Only use Typescript linting on Typescript files
			rules: {
				// TODO: update this to 'warn' or delete once the post-migration fixing process is done
				'import/no-default-export': 'off',
				'react/function-component-definition': [
					1,
					{
						namedComponents: 'function-declaration',
						unnamedComponents: 'function-expression',
					},
				],
				'@emotion/pkg-renaming': 'error',
			},
		},
	],
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			typescript: {
				project: 'tsconfig.json',
			},
		},
	},
	plugins: ['react', '@emotion'],
};
