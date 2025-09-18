const { convertJs: convertToSass } = require('json-sass-vars');

const green = {
	dark: '#185E36',
	main: '#22874D',
};

const red = {
	dark: '#ab0613',
	main: '#c70000',
};

const brand = {
	dark: '#041f4a',
	main: '#052962',
	pastel: '#506991',
};

const state = {
	success: green.main,
	error: red.main,
};

const highlight = {
	main: '#ffe500',
	dark: '#ffbb50',
};

const neutral = {
	7: '#121212',
	20: '#333333',
	46: '#767676',
	60: '#999999',
	85: '#d9d9d9',
	86: '#dcdcdc',
	93: '#ededed',
	97: '#f6f6f6',
	100: '#ffffff',
};

const lightTheme = {
	border: neutral[86],
};

const news = {
	dark: red.dark,
	main: red.main,
	bright: '#ff4e36',
	pastel: '#ffbac8',
	faded: '#fff4f2',
	neutral: lightTheme,
};

const sport = {
	dark: '#005689',
	main: '#0084c6',
	bright: '#00b2ff',
	pastel: '#90dcff',
	faded: '#f1f8fc',
	neutral: lightTheme,
};

const palette = {
	news,
	sport,
	highlight,
	neutral,
	green,
	brand,
	state,
};

/*
Given the pasteup palette,
this function flattens all colours into a
child free map where the keys are named as
parent-child.
*/
const flatten = (obj, prefixes = []) =>
	Object.entries(obj).reduce(
		(prev, [key, val]) =>
			typeof val === 'string'
				? {
						...prev,
						[[...prefixes, key].join('-')]: val,
				  }
				: {
						...prev,
						...flatten(val, [...prefixes, key]),
				  },
		{},
	);

const paletteAsMap = () => flatten(palette);
const paletteAsSass = () => `$palette: ${convertToSass(paletteAsMap())};`;

module.exports = { paletteAsSass };
