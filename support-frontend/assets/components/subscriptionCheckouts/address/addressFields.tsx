import { css } from '@emotion/react';
import { isNonNullable } from '@guardian/libs';
import { palette, space } from '@guardian/source/foundations';
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
import { currencies } from 'helpers/internationalisation/currency';
import type {
	AddressFieldsState,
	AddressFields as AddressFieldsType,
	AddressFormFieldError,
	PostcodeFinderState,
} from 'helpers/redux/checkout/address/state';
import { isPostcodeOptional } from 'helpers/redux/checkout/address/validation';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { canShow } from 'hocs/canShow';
import {
	doesNotContainEmojiPattern,
	preventDefaultValidityMessage,
} from '../../../pages/[countryGroupId]/validation';
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
	setErrors?: React.Dispatch<React.SetStateAction<AddressFormFieldError[]>>;
	onFindAddress: (postcode: string) => void;
};

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

const readOnlyInput = css`
	background: #f6f6f6 !important;
`;

const selectStateStyles = css`
	&:invalid:not(&:user-invalid) {
		/* Remove styling of invalid select element */
		border: 1px solid ${palette.neutral[46]};
	}
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

type ValidityStateError = 'valueMissing' | 'patternMismatch';

export function AddressFields({
	scope,
	countryGroupId,
	...props
}: PropTypes): JSX.Element {
	const patternMismatch = 'Please use only letters, numbers and punctuation.';
	const errorMessages: Record<
		keyof AddressFieldsType,
		{ [key in ValidityStateError]?: string }
	> = {
		country: {
			valueMissing: `Please enter a ${scope} country.`,
		},
		lineOne: {
			valueMissing: `Please enter a ${scope} address.`,
			patternMismatch,
		},
		lineTwo: {
			patternMismatch,
		},
		city: {
			valueMissing: `Please enter a ${scope} town/city.`,
			patternMismatch,
		},
		state: {
			valueMissing:
				props.country === 'CA'
					? `Please select a ${scope} province/territory.`
					: `Please select a ${scope} state.`,
			patternMismatch,
		},
		postCode: {
			valueMissing: `Please enter a ${scope} ${
				props.country === 'US' ? 'ZIP code' : 'postcode'
			}`,
			patternMismatch,
		},
	};
	const setErrorsOnInvalid = (
		event:
			| React.FormEvent<HTMLInputElement>
			| React.FormEvent<HTMLSelectElement>,
		field: keyof AddressFieldsType,
	) => {
		/**
		 * We only pass/use setErrors on the generic checkout.
		 * On the non-generic checkouts we don't pass it
		 * to AddressFields as Redux/Zod handles validation errors.
		 **/
		if (!props.setErrors) {
			return;
		}

		preventDefaultValidityMessage(event.currentTarget);
		const validityState = event.currentTarget.validity;
		if (validityState.valid) {
			// remove all errors for the field
			props.setErrors(
				props.errors.filter((error) => {
					return error.field != field;
				}),
			);
		} else {
			const possibleValidityStateErrors: ValidityStateError[] = [
				'valueMissing',
				'patternMismatch',
			];
			const updatedErrors: AddressFormFieldError[] = [
				// remove all errors for field
				...props.errors.filter((error) => {
					return error.field != field;
				}),
				// add all unresolved errors for the field
				...possibleValidityStateErrors
					.map((possibleValidityStateError) => {
						if (validityState[possibleValidityStateError]) {
							return {
								field,
								message: errorMessages[field][possibleValidityStateError] ?? '',
							};
						}
					})
					.filter(isNonNullable),
			];
			props.setErrors(updatedErrors);
		}
	};

	const countriesLength = Object.keys(props.countries).length;
	return (
		<div data-component={`${scope}AddressFields`}>
			{countryGroupId && (
				<Select
					css={[marginBottom]}
					id={`${scope}-country-group`}
					data-qm-masking="blocklist"
					label="World zone"
					value={countryGroupId}
					onChange={(event) => {
						event.preventDefault();
						const pathname = window.location.pathname;
						const currentCountryGroup = pathname.split('/')[1];
						const supportInternationalisationId =
							countryGroups[event.currentTarget.value as CountryGroupId]
								.supportInternationalisationId;
						const newPathname = pathname.replace(
							currentCountryGroup,
							supportInternationalisationId,
						);
						const location = `${newPathname}${window.location.search}`;
						window.location.href = location;
					}}
					data-link-name={`${scope}CountryGroupSelect : ${props.country}`}
					error={firstError('country', props.errors)}
					name={`${scope}-country-group`}
				>
					{Object.entries(countryGroups)
						.sort()
						.map(([key, countryGroup]) => (
							<OptionForSelect
								key={key}
								value={key}
								selected={key === countryGroupId}
							>
								{/** we use a join here due to the type of children being `string` */}
								{/** this isn't actually the case for options, but Source has rewritten it as such */}
								{/** @see https://github.com/guardian/csnx/blob/3ac083e3f7e0e14ba5f8efd46a58029b7ce2cd3a/libs/%40guardian/source/src/react-components/select/Option.tsx#L7 */}
								{[
									countryGroup.name,
									' | ',
									currencies[countryGroups[key as CountryGroupId].currency]
										.extendedGlyph,
								].join('')}
							</OptionForSelect>
						))}
				</Select>
			)}
			{countriesLength > 1 && (
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
			)}
			{countriesLength === 1 && (
				<TextInput
					css={[marginBottom, readOnlyInput]}
					id={`${scope}-country`}
					data-qm-masking="blocklist"
					label="Country"
					value={props.country}
					error={firstError('country', props.errors)}
					name={`${scope}-country`}
					data-link-name={`${scope}CountryTextInput : ${props.country}`}
					readOnly={true}
				/>
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
				maxLength={100}
				pattern={doesNotContainEmojiPattern}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'lineOne');
				}}
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
				maxLength={100}
				pattern={doesNotContainEmojiPattern}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'lineTwo');
				}}
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
				pattern={doesNotContainEmojiPattern}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'city');
				}}
			/>
			<MaybeSelect
				css={[marginBottom, selectStateStyles]}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label={props.country === 'CA' ? 'Province/Territory' : 'State'}
				value={props.state}
				onChange={(e) => props.setState(e.target.value)}
				error={firstError('state', props.errors)}
				isShown={shouldShowStateDropdown(props.country)}
				name={`${scope}-stateProvince`}
				required
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'state');
				}}
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
				pattern={doesNotContainEmojiPattern}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'state');
				}}
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
				maxLength={20}
				pattern={doesNotContainEmojiPattern}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'postCode');
				}}
			/>
		</div>
	);
}
