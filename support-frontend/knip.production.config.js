const normalConfig = require('./knip.config');

module.exports = Object.assign({}, normalConfig, {
	ignoreExportsUsedInFile: true,
});
