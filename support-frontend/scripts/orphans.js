const path = require('path');
const madge = require('madge');
const chalk = require('chalk');
const entryPoints = require('../webpack.entryPoints');

const flattenedEntryPoints = Object.keys(entryPoints).reduce(
	(acc, key) => ({
		...acc,
		...entryPoints[key],
	}),
	{},
);

const baseDir = path.join(__dirname, '..', 'assets');

const config = {
	baseDir,
	fileExtensions: [
		'ts',
		'tsx',
		// 'scss' // TODO: reinstate .scss orphans lookup
	],
};

madge(baseDir, config)
	.then((result) => {
		const testDirectoryName = '__tests__';
		const warningColour = chalk.rgb(245, 123, 66);
		const noWarningColour = chalk.keyword('green');
		const jsOrphans = result
			.orphans()
			.filter((orphanPath) => path.extname(orphanPath) !== '.scss');
		const scssOrphans = result
			.orphans()
			.filter((orphanPath) => path.extname(orphanPath) === '.scss');
		const entryPointPaths = Object.keys(flattenedEntryPoints).map(
			(entryPoint) => flattenedEntryPoints[entryPoint],
		);
		// filter out entryPointPaths and tests from jsOrphans
		const jsOrphansFiltered = jsOrphans.filter(
			(orphanPath) =>
				!entryPointPaths.includes(orphanPath) &&
				path.basename(path.dirname(orphanPath)) !== testDirectoryName,
		);
		// filter out entryPointPaths from scssOrphans
		const scssOrphansFiltered = scssOrphans.filter(
			(orphanPath) => !entryPointPaths.includes(orphanPath),
		);
		if (!jsOrphansFiltered && !scssOrphansFiltered) {
			console.log(noWarningColour('No orphan modules identified!'));
		} else {
			if (jsOrphansFiltered.length) {
				console.log(
					`${'\n'}${warningColour.bold(
						`${jsOrphansFiltered.length} orphan .ts/.tsx modules identified...`,
					)}`,
				);
				jsOrphansFiltered.forEach((orphan) =>
					console.log(warningColour(orphan)),
				);
			}
			if (scssOrphansFiltered.length) {
				console.log(
					`${'\n'}${warningColour.bold(
						`${scssOrphansFiltered.length} orphan .scss modules identified...`,
					)}`,
				);
				scssOrphansFiltered.forEach((orphan) =>
					console.log(warningColour(orphan)),
				);
			}
		}
	})
	.catch((e) => {
		console.log(`\n${e}\n`);
	});
