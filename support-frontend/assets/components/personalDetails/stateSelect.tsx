import { Option, Select } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';

type StateSelectProps = {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	state: string;
	onStateChange: (newState: string) => void;
	error?: string;
};

const stateDescriptors: Partial<Record<CountryGroupId, string>> = {
	UnitedStates: 'State',
	Canada: 'Province',
	AUDCountries: 'State / Territory',
};

const stateLists: Partial<Record<CountryGroupId, Record<string, string>>> = {
	UnitedStates: usStates,
	Canada: caStates,
	AUDCountries: auStates,
};

export function StateSelect({
	countryGroupId,
	contributionType,
	state,
	onStateChange,
	error,
}: StateSelectProps): JSX.Element | null {
	const statesList = stateLists[countryGroupId] ?? {};

	if (shouldCollectStateForContributions(countryGroupId, contributionType)) {
		return (
			<div>
				<Select
					id="state"
					label={stateDescriptors[countryGroupId] ?? 'State'}
					value={state}
					onChange={(e) => onStateChange(e.target.value)}
					error={error}
				>
					<>
						<Option value="">
							{`Select your ${
								stateDescriptors[countryGroupId]?.toLowerCase() ?? 'state'
							}`}
						</Option>
						{Object.entries(statesList).map(([abbreviation, name]) => {
							return (
								<Option value={abbreviation} selected={abbreviation === state}>
									{name}
								</Option>
							);
						})}
					</>
				</Select>
			</div>
		);
	}
	return null;
}
