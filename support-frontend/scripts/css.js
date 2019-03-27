const path = require('path');

const camelCaseToDash = str =>
  str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

const getClassName = (resource, localName) => {
  const { dir, name } = path.parse(resource);
  const getStartingName = (p) => {
    if (p === 'pages') { return null; } else if (p === 'components') { return 'component'; }
    return p;
  };
  let identity =
    camelCaseToDash([
      getStartingName(dir.split(path.sep).splice(1, 1)[0]),
      ...dir.split(path.sep).splice(2),
      name.substr(0, name.indexOf('.')),
    ].filter(Boolean).join('-'));

  if (localName.substring(0, 4) === 'with') {
    identity += `--${camelCaseToDash(localName.substring(4))}`;
  } else if (localName !== 'root') {
    identity += `__${camelCaseToDash(localName)}`;
  }
  return identity;
};

module.exports = { getClassName };
