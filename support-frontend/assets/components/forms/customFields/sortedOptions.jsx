// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Functions ----- //

function sortedOptions(os: { [string]: string }): React$Node {

  return Object.keys(os)
    .sort((a, b) => os[a].localeCompare(os[b]))
    .map(k => <option value={k}>{os[k]}</option>);

}


// ----- Exports ----- //

export { sortedOptions };
