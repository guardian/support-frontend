// ----- Imports ----- //
import { Option } from '@guardian/src-select';
import type { ReactNode } from 'react';
import React from 'react';

// ----- Functions ----- //
const options = (optionsForMapping: Record<string, string>): ReactNode =>
	Object.keys(optionsForMapping).map((key) => (
		<Option value={key}>{optionsForMapping[key]}</Option>
	));

// ----- Exports ----- //
export { options };
