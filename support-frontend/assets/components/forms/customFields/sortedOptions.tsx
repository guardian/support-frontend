// ----- Imports ----- //
import { Option } from '@guardian/source-react-components';
import * as React from 'react';

// ----- Functions ----- //
function sortedOptions(
	optionsForSorting: Record<string, string>,
): React.ReactNode {
	return Object.keys(optionsForSorting)
		.sort((a, b) => optionsForSorting[a].localeCompare(optionsForSorting[b]))
		.map((key) => <Option value={key}>{optionsForSorting[key]}</Option>);
}

// ----- Exports ----- //
export { sortedOptions };
