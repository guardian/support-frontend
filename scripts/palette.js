const flatten = (obj, prefixes = []) => Object.entries(obj)
  .reduce((prev, [key, val]) => ((typeof val === 'string') ?
    {
      ...prev,
      [[...prefixes, key].join('-')]: val,
    }
    : {
      ...prev,
      ...flatten(val, [...prefixes, key]),
    }), {});

module.exports = { flatten };
