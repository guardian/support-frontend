const entryPoints = require('../webpack.entryPoints').common;

const flattenedEntryPoints = [...Object.keys(entryPoints)].map(
	(key) => `assets/${entryPoints[key]}`,
);

module.exports = {
	entry: flattenedEntryPoints,
	project: ['**/*.{js,jsx,ts,tsx,scss}!'],
	ignoreExportsUsedInFile: true,
	webpack: {
		entry: ['webpack.*.js'],
	},
};
