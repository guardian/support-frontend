import { css } from '@emotion/react';
import { neutral, space, textSans } from '@guardian/source/foundations';
import {
	Option as OptionForSelect,
	Select,
	TextInput,
} from '@guardian/source/react-components';
import React from 'react';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { PostcodeFinder } from 'components/subscriptionCheckouts/address/postcodeFinder';
import { Country } from 'helpers/internationalisation';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type {
	AddressFieldsState,
	PostcodeFinderState,
} from 'helpers/redux/checkout/address/state';
import { isPostcodeOptional } from 'helpers/redux/checkout/address/validation';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { canShow } from 'hocs/canShow';
import type { PostcodeFinderResult } from './postcodeLookup';

type StatePropTypes = AddressFieldsState & {
	scope: AddressType;
	countryGroupId?: CountryGroupId;
	countries: Record<string, string>;
	postcodeState: PostcodeFinderState;
};

type PropTypes = StatePropTypes & {
	setLineOne: (lineOne: string) => void;
	setLineTwo: (lineTwo: string) => void;
	setTownCity: (city: string) => void;
	setState: (state: string) => void;
	setPostcode: (postCode: string) => void;
	setCountry: (countryRaw: IsoCountry) => void;
	setPostcodeForFinder: (postcode: string) => void;
	setPostcodeErrorForFinder: (error: string) => void;
	onFindAddress: (postcode: string) => void;
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

const countryGroupSelectContainer = css`
	${textSans.xsmall({ fontWeight: 'light' })}
	color: ${neutral[7]};
	margin-top: -20px;
	margin-bottom: 20px;
	display: block;
	position: relative;
`;

const countryGroupSelect = css`
	margin-left: 5px;
`;

export function AddressFields({
	scope,
	countryGroupId,
	...props
}: PropTypes): JSX.Element {
	return (
		<div data-component={`${scope}AddressFields`}>
			<Select
				css={marginBottom}
				id={`${scope}-country`}
				data-qm-masking="blocklist"
				label="Country"
				value={props.country}
				onChange={(e) => {
					const isoCountry = Country.fromString(e.target.value);
					if (isoCountry) {
						props.setCountry(isoCountry);
					}
				}}
				error={firstError('country', props.errors)}
				name={`${scope}-country`}
				data-link-name={`${scope}CountrySelect : ${props.country}`}
			>
				<OptionForSelect value="">Select a country</OptionForSelect>
				{sortedOptions(props.countries)}
			</Select>
			{countryGroupId && (
				<div css={countryGroupSelectContainer}>
					<span>Can't find your country? Try another zone</span>
					<select
						css={countryGroupSelect}
						onChange={(event) => {
							event.preventDefault();
							const pathname = window.location.pathname;
							const currentCountryGroup = pathname.split('/')[1];
							const newPathname = pathname.replace(
								currentCountryGroup,
								event.currentTarget.value,
							);
							const location = `${newPathname}${window.location.search}`;
							window.location.href = location;
						}}
						data-link-name={`${scope}CountryGroupSelect : ${props.country}`}
					>
						{Object.entries(countryGroups).map(([key, value]) => (
							<option
								key={key}
								value={value.supportInternationalisationId}
								selected={key === countryGroupId}
							>
								{value.supportInternationalisationId.toUpperCase()}{' '}
								{value.currency}
							</option>
						))}
					</select>
				</div>
			)}
			{props.country === 'GB' ? (
				<PostcodeFinder
					postcode={props.postcodeState.postcode}
					isLoading={props.postcodeState.isLoading}
					error={props.postcodeState.error}
					results={props.postcodeState.results}
					onPostcodeUpdate={(postcode) => {
						props.setPostcode(postcode);
						props.setPostcodeForFinder(postcode);
					}}
					onPostcodeError={props.setPostcodeErrorForFinder}
					onFindAddress={props.onFindAddress}
					onAddressSelected={({
						lineOne,
						lineTwo,
						city,
					}: PostcodeFinderResult) => {
						props.setLineOne(lineOne ?? '');
						props.setLineTwo(lineTwo ?? '');
						props.setTownCity(city ?? '');
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
				onChange={(e) => props.setLineOne(e.target.value)}
				error={firstError('lineOne', props.errors)}
				name={`${scope}-lineOne`}
			/>
			<TextInput
				css={marginBottom}
				id={`${scope}-lineTwo`}
				data-qm-masking="blocklist"
				label="Address Line 2"
				optional
				type="text"
				value={props.lineTwo ?? ''}
				onChange={(e) => props.setLineTwo(e.target.value)}
				error={firstError('lineTwo', props.errors)}
				name={`${scope}-lineTwo`}
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
				error={firstError('city', props.errors)}
				name={`${scope}-city`}
			/>
			<MaybeSelect
				css={marginBottom}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label={props.country === 'CA' ? 'Province/Territory' : 'State'}
				value={props.state}
				onChange={(e) => props.setState(e.target.value)}
				error={firstError('state', props.errors)}
				isShown={shouldShowStateDropdown(props.country)}
				name={`${scope}-stateProvince`}
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
				value={props.state}
				onChange={(e) => props.setState(e.target.value)}
				error={firstError('state', props.errors)}
				optional
				isShown={shouldShowStateInput(props.country)}
				name={`${scope}-stateProvince`}
			/>
			<TextInput
				css={marginBottom}
				id={`${scope}-postcode`}
				data-qm-masking="blocklist"
				label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
				type="text"
				optional={isPostcodeOptional(props.country)}
				value={props.postCode}
				onChange={(e) => props.setPostcode(e.target.value)}
				error={firstError('postCode', props.errors)}
				name={`${scope}-postcode`}
			/>
		</div>
	);
}
