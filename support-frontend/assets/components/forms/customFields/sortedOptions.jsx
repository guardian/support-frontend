// @flow

// ----- Imports ----- //

import React from 'react';
import { Option } from '@guardian/src-select';

// ----- Functions ----- //

function sortedOptions(os: { [string]: string }): React$Node {
  return Object.keys(os)
    .sort((a, b) => os[a].localeCompare(os[b]))
    .map(k => <Option value={k}>{os[k]}</Option>);
}

// ----- Exports ----- //

export { sortedOptions };
