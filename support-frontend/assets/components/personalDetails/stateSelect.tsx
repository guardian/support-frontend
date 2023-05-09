import { Option, Select } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';

type StateSelectProps = {
	countryId: IsoCountry;
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
	countryId,
	contributionType,
	state,
	onStateChange,
	error,
}: StateSelectProps): JSX.Element | null {
	const countryGroupId = fromCountry(countryId);
	const statesList = (countryGroupId ? stateLists[countryGroupId] : {}) ?? {};
	const stateDescriptor =
		(countryGroupId ? stateDescriptors[countryGroupId] : 'State') ?? 'State';

	if (shouldCollectStateForContributions(countryId, contributionType)) {
		return (
			<div>
				<Select
					id="state"
					label={stateDescriptor}
					value={state}
					onChange={(e) => onStateChange(e.target.value)}
					error={error}
				>
					<>
						<Option value="">
							{`Select your ${stateDescriptor.toLowerCase()}`}
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
