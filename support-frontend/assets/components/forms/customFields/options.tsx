// ----- Imports ----- //
import { Option } from '@guardian/src-select';
import React from 'react';

// ----- Functions ----- //
const options = (optionsForMapping: Record<string, string>): JSX.Element => {
	return (
		<>
			{Object.keys(optionsForMapping).map((key) => (
				<Option value={key}>{optionsForMapping[key]}</Option>
			))}
		</>
	);
};

// ----- Exports ----- //
export { options };
