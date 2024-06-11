module.exports = {
	presets: ['@babel/preset-env'], // This is only used for jest annoyingly
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-transform-exponentiation-operator',
		'@babel/plugin-syntax-dynamic-import',
	],
	sourceType: 'unambiguous',
};
