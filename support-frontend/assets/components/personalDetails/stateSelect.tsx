import { Option, Select } from '@guardian/source-react-components';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';

type StateSelectProps = {
	countryGroupId: CountryGroupId;
	state: string;
	onStateChange: (newState: string) => void;
	error?: string;
};

const stateDescriptors: Partial<Record<CountryGroupId, string>> = {
	UnitedStates: 'state',
	Canada: 'province',
	AUDCountries: 'state / territory',
};

const stateLists: Partial<Record<CountryGroupId, Record<string, string>>> = {
	UnitedStates: usStates,
	Canada: caStates,
	AUDCountries: auStates,
};

function getLabel(countryGroupId: CountryGroupId) {
	const descriptor = stateDescriptors[countryGroupId] ?? 'state';

	return `Please select your ${descriptor}`;
}

export default function StateSelect({
	countryGroupId,
	state,
	onStateChange,
	error,
}: StateSelectProps): JSX.Element | null {
	const statesList = stateLists[countryGroupId] ?? {};

	if (shouldCollectStateForContributions(countryGroupId)) {
		return (
			<div>
				<Select
					id="state"
					label={getLabel(countryGroupId)}
					value={state}
					onChange={(e) => onStateChange(e.target.value)}
					error={error}
				>
					<>
						<Option value="">&nbsp;</Option>
						{Object.entries(statesList).map(([abbreviation, name]) => {
							return <Option value={abbreviation}>{name}</Option>;
						})}
					</>
				</Select>
			</div>
		);
	}
	return null;
}
