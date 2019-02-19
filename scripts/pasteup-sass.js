const { convertJs: convertToSass } = require('json-sass-vars');
const { palette } = require('@guardian/pasteup/palette');

/*
Given the pasteup palette,
this function flattens all colours into a
child free map where the keys are named as
parent-child.
*/
const flatten = (obj, prefixes = []) => Object.entries(obj)
  .reduce((prev, [key, val]) => ((typeof val === 'string') ?
    {
      ...prev,
      [[...prefixes, key].join('-').replace('neutral-', 'brightness-')]: val,
    }
    : {
      ...prev,
      ...flatten(val, [...prefixes, key]),
    }), {});

const paletteAsMap = () => flatten(palette);
const paletteAsSass = () => `$palette: ${convertToSass(paletteAsMap())};`;


module.exports = { flatten, paletteAsMap, paletteAsSass };
