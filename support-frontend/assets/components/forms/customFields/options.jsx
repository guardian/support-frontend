// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { Option } from '@guardian/src-select';

// ----- Functions ----- //

const options = (optionsForMapping: { [string]: string }): Node => Object.keys(optionsForMapping)
  .map(key => <Option value={key}>{optionsForMapping[key]}</Option>);

// ----- Exports ----- //

export { options };
