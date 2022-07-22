// ----- Imports ----- //
import { Option } from '@guardian/source-react-components';

// ----- Functions ----- //
function sortedOptions(optionsForSorting: Record<string, string>): JSX.Element {
	return (
		<>
			{Object.keys(optionsForSorting)
				.sort((a, b) =>
					optionsForSorting[a].localeCompare(optionsForSorting[b]),
				)
				.map((key) => (
					<Option value={key} key={key}>
						{optionsForSorting[key]}
					</Option>
				))}
		</>
	);
}

// ----- Exports ----- //
export { sortedOptions };
