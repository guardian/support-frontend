import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Select,
	TextInput,
} from '@guardian/source-react-components';
import React from 'react';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import 'helpers/subscriptionsForms/addressType';
import type {
	ActionCreators as AddressActionCreators,
	FormField,
	FormFields,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { isPostcodeOptional } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { PostcodeFinder } from 'components/subscriptionCheckouts/address/postcodeFinder';
import type { PostcodeFinderState } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { canShow } from 'hocs/canShow';
import type { PostcodeFinderResult } from './postcodeLookup';

type StatePropTypes = FormFields & {
	countries: Record<string, string>;
	scope: AddressType;
	formErrors: Array<FormError<FormField>>;
	postcodeState: PostcodeFinderState;
};

type PropTypes = StatePropTypes &
	AddressActionCreators & {
		setPostcodeForFinder: (postcode: string) => void;
		fetchResults: (postcode?: string) => void;
	};

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

const MaybeSelect = canShow(Select);
const MaybeInput = canShow(TextInput);

function shouldShowStateDropdown(country: Option<IsoCountry>): boolean {
	return country === 'US' || country === 'CA' || country === 'AU';
}

function shouldShowStateInput(country: Option<IsoCountry>): boolean {
	return country !== 'GB' && !shouldShowStateDropdown(country);
}

function statesForCountry(country: Option<IsoCountry>): React.ReactNode {
	switch (country) {
		case 'US':
			return sortedOptions(usStates);

		case 'CA':
			return sortedOptions(caStates);

		case 'AU':
			return sortedOptions(auStates);

		default:
			return null;
	}
}

export function AddressFields({ scope, ...props }: PropTypes): JSX.Element {
	return (
		<div>
			<Select
				css={marginBottom}
				id={`${scope}-country`}
				data-qm-masking="blocklist"
				label="Country"
				value={props.country}
				onChange={(e) => props.setCountry(e.target.value)}
				error={firstError('country', props.formErrors)}
			>
				<OptionForSelect value="">Select a country</OptionForSelect>
				{sortedOptions(props.countries)}
			</Select>
			{props.country === 'GB' ? (
				<PostcodeFinder
					{...props.postcodeState}
					setPostcode={props.setPostcodeForFinder}
					fetchResults={props.fetchResults}
					id={`${scope}-postcode-lookup`}
					onPostcodeUpdate={props.setPostcode}
					onAddressUpdate={({
						lineOne,
						lineTwo,
						city,
					}: PostcodeFinderResult) => {
						if (lineOne) {
							props.setAddressLineOne(lineOne);
						}

						if (lineTwo) {
							props.setAddressLineTwo(lineTwo);
						}

						if (city) {
							props.setTownCity(city);
						}
					}}
				/>
			) : null}
			<TextInput
				css={marginBottom}
				id={`${scope}-lineOne`}
				data-qm-masking="blocklist"
				label="Address Line 1"
				type="text"
				value={props.lineOne ?? ''}
				onChange={(e) => props.setAddressLineOne(e.target.value)}
				error={firstError('lineOne', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id={`${scope}-lineTwo`}
				data-qm-masking="blocklist"
				label="Address Line 2"
				optional
				type="text"
				value={props.lineTwo ?? ''}
				onChange={(e) => props.setAddressLineTwo(e.target.value)}
				error={firstError('lineTwo', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id={`${scope}-city`}
				data-qm-masking="blocklist"
				label="Town/City"
				type="text"
				maxLength={40}
				value={props.city ?? ''}
				onChange={(e) => props.setTownCity(e.target.value)}
				error={firstError('city', props.formErrors)}
			/>
			<MaybeSelect
				css={marginBottom}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label={props.country === 'CA' ? 'Province/Territory' : 'State'}
				value={props.state ?? ''}
				onChange={(e) => props.setState(e.target.value)}
				error={firstError('state', props.formErrors)}
				isShown={shouldShowStateDropdown(props.country)}
			>
				<>
					<OptionForSelect value="">{`Select a ${
						props.country === 'CA' ? 'province/territory' : 'state'
					}`}</OptionForSelect>
					{statesForCountry(props.country)}
				</>
			</MaybeSelect>
			<MaybeInput
				css={marginBottom}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label="State"
				value={props.state ?? ''}
				onChange={(e) => props.setState(e.target.value)}
				error={firstError('state', props.formErrors)}
				optional
				isShown={shouldShowStateInput(props.country)}
			/>
			<TextInput
				css={marginBottom}
				id={`${scope}-postcode`}
				data-qm-masking="blocklist"
				label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
				type="text"
				optional={isPostcodeOptional(props.country)}
				value={props.postCode ?? ''}
				onChange={(e) => props.setPostcode(e.target.value)}
				error={firstError('postCode', props.formErrors)}
			/>
		</div>
	);
}
