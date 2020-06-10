const path = require('path');
const madge = require('madge');
const chalk = require('chalk');
const entryPoints = require('../webpack.entryPoints');

const flattenedEntryPoints = Object.keys(entryPoints).reduce((acc, key) => ({
  ...acc,
  ...entryPoints[key],
}), {});

const config = {
  baseDir: path.join(__dirname, '..', 'assets'),
  fileExtensions: ['js', 'jsx', 'scss'],
};

const assetsPath = path.join(__dirname, '..', 'assets');

madge(assetsPath, config).then((result) => {
  const testDirectoryName = '__tests__';
  const warningColour = chalk.rgb(245, 123, 66);
  const noWarningColour = chalk.keyword('green');
  const jsOrphans = result.orphans().filter(orphanPath => path.extname(orphanPath) !== '.scss');
  const scssOrphans = result.orphans().filter(orphanPath => path.extname(orphanPath) === '.scss');
  const entryPointPaths = Object.keys(flattenedEntryPoints).map(entryPoint => flattenedEntryPoints[entryPoint]);
  // filter out entryPointPaths and tests from jsOrphans
  const jsOrphansFiltered = jsOrphans.filter(orphanPath =>
    !entryPointPaths.includes(orphanPath) && path.basename(path.dirname(orphanPath)) !== testDirectoryName);

  if (!jsOrphansFiltered && !scssOrphans) {
    console.log(noWarningColour('No orphan modules identified!'));
  } else {
    if (jsOrphansFiltered) {
      console.log(`${'\n'}${warningColour.bold(`${jsOrphansFiltered.length} orphan .js/.jsx modules identified...`)}`);
      jsOrphansFiltered.forEach(orphan => console.log(warningColour(orphan)));
    }
    if (scssOrphans) {
      console.log(`${'\n'}${warningColour.bold(`${scssOrphans.length} orphan .scss modules identified...`)}`);
      scssOrphans.forEach(orphan => console.log(warningColour(orphan)));
    }
  }
}).catch((e) => {
  console.log(`\n${e}\n`);
});

