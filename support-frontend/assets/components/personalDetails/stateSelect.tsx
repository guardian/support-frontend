import { css } from '@emotion/react';
import { Option, Select } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { FormEventHandler } from 'react';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';

type StateSelectProps = {
	countryId: IsoCountry;
	state?: string;
	onStateChange: FormEventHandler<HTMLSelectElement>;
	onBlur?: FormEventHandler<HTMLSelectElement>;
	onInvalid?: FormEventHandler<HTMLSelectElement>;
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
	state,
	onStateChange,
	onBlur,
	onInvalid,
	error,
}: StateSelectProps): JSX.Element | null {
	const countryGroupId = CountryGroup.fromCountry(countryId);
	const statesList = (countryGroupId ? stateLists[countryGroupId] : {}) ?? {};
	const stateDescriptor =
		(countryGroupId ? stateDescriptors[countryGroupId] : 'State') ?? 'State';

	return (
		<div>
			<Select
				id="state"
				label={stateDescriptor}
				value={state}
				onChange={onStateChange}
				onBlur={onBlur}
				onInvalid={onInvalid}
				error={error}
				name={'billing-state'}
				required
				cssOverrides={
					/**
					 * Source applies a red border initially unlike textInput's
					 */
					!error
						? css`
								:invalid {
									border-color: #707070;
									border-width: 1px;
								}
						  `
						: undefined
				}
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
