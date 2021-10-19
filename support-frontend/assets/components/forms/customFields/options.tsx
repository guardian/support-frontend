// ----- Imports ----- //
import type { Node } from 'react';
import React from 'react';
import { Option } from '@guardian/src-select';

// ----- Functions ----- //
const options = (optionsForMapping: Record<string, string>): Node =>
	Object.keys(optionsForMapping).map((key) => (
		<Option value={key}>{optionsForMapping[key]}</Option>
	));

// ----- Exports ----- //
export { options };
