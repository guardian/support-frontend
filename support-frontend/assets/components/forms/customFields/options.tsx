// ----- Imports ----- //
import { Option } from '@guardian/source-react-components';

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
