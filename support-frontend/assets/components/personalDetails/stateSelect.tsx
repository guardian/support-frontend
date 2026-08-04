import { css } from '@emotion/react';
import { Option, Select } from '@guardian/source/react-components';
import type { CountryCode } from '@modules/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from '@modules/internationalisation/state';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegionIdFromCountryCode } from '@modules/internationalisation/supportRegion';
import type { FormEventHandler } from 'react';

type StateSelectProps = {
	countryId: CountryCode;
	state: string;
	onStateChange: FormEventHandler<HTMLSelectElement>;
	onBlur?: FormEventHandler<HTMLSelectElement>;
	onInvalid?: FormEventHandler<HTMLSelectElement>;
	error?: string;
};

const stateDescriptors: Partial<Record<SupportRegionId, string>> = {
	us: 'State',
	ca: 'Province',
	au: 'State / Territory',
};

const stateLists: Partial<Record<SupportRegionId, Record<string, string>>> = {
	us: usStates,
	ca: caStates,
	au: auStates,
};

export function StateSelect({
	countryId,
	state,
	onStateChange,
	onBlur,
	onInvalid,
	error,
}: StateSelectProps): JSX.Element | null {
	const supportRegionId = supportRegionIdFromCountryCode(countryId);
	const statesList = stateLists[supportRegionId] ?? {};
	const stateDescriptor = stateDescriptors[supportRegionId] ?? 'State';

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
