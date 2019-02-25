// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

// ----- Functions ----- //

const options = (os: { [string]: string }): Node => Object.keys(os).map(k => <option value={k}>{os[k]}</option>);

// ----- Exports ----- //

export { options };
