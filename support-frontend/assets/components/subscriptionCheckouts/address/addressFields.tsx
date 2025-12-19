import { css } from '@emotion/react';
import { isNonNullable } from '@guardian/libs';
import { palette, space } from '@guardian/source/foundations';
import {
	Option as OptionForSelect,
	Select,
	TextInput,
} from '@guardian/source/react-components';
import {
	auStates,
	caStates,
	usStates,
} from '@modules/internationalisation/country';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type React from 'react';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { PostcodeFinder } from 'components/subscriptionCheckouts/address/postcodeFinder';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { internationaliseProductAndRatePlan } from 'helpers/productCatalog';
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
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
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

const selectStateStyles = css`
	&:invalid:not(&:user-invalid) {
		/* Remove styling of invalid select element */
		border: 1px solid ${palette.neutral[46]};
	}
`;

type MaybeSelectProps = {
	isShown: boolean;
} & React.ComponentProps<typeof Select>;
function MaybeSelect(props: MaybeSelectProps) {
	const { isShown, ...rest } = props;
	return isShown ? <Select {...rest} /> : null;
}

type MaybeInputProps = {
	isShown: boolean;
} & React.ComponentProps<typeof TextInput>;
function MaybeInput(props: MaybeInputProps) {
	const { isShown, ...rest } = props;
	return isShown ? <TextInput {...rest} /> : null;
}

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
	country,
	lineOne,
	lineTwo,
	city,
	state,
	postCode,
	errors,
	countries,
	postcodeState,
	setLineOne,
	setLineTwo,
	setTownCity,
	setState,
	setPostcode,
	setCountry,
	setPostcodeForFinder,
	setPostcodeErrorForFinder,
	setErrors,
	onFindAddress,
}: PropTypes) {
	const patternMismatch = 'Please use only letters, numbers and punctuation.';
	const errorMessages: Record<
		keyof AddressFieldsType,
		Partial<Record<ValidityStateError, string>>
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
				country === 'CA'
					? `Please select a ${scope} province/territory.`
					: `Please select a ${scope} state.`,
			patternMismatch,
		},
		postCode: {
			valueMissing: `Please enter a ${scope} ${
				country === 'US' ? 'ZIP code' : 'postcode'
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
		if (!setErrors) {
			return;
		}

		preventDefaultValidityMessage(event.currentTarget);
		const validityState = event.currentTarget.validity;
		if (validityState.valid) {
			// remove all errors for the field
			setErrors(
				errors.filter((error) => {
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
				...errors.filter((error) => {
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

						return;
					})
					.filter(isNonNullable),
			];
			setErrors(updatedErrors);
		}
	};

	return (
		<div data-component={`${scope}AddressFields`}>
			<Select
				cssOverrides={marginBottom}
				id={`${scope}-country`}
				data-qm-masking="blocklist"
				label="Country"
				value={country}
				onChange={(event) => {
					const selectedCountry = Country.fromString(event.target.value);

					if (selectedCountry && countryGroupId) {
						const selectedCountryGroup = Object.entries(countryGroups).find(
							([, countryGroup]) =>
								countryGroup.countries.includes(selectedCountry),
						)?.[0];

						if (countryGroupId !== selectedCountryGroup) {
							const pathname = window.location.pathname;
							const currentInternationalisationId =
								pathname.split('/')[1] ?? '';
							const selectedInternationalisationId =
								countryGroups[selectedCountryGroup as CountryGroupId]
									.supportRegionId;
							const redirectPathname = pathname.replace(
								currentInternationalisationId,
								selectedInternationalisationId,
							);

							const urlSearchParams = new URLSearchParams(
								window.location.search,
							);
							urlSearchParams.set('country', selectedCountry);
							const product = urlSearchParams.get(
								'product',
							) as ActiveProductKey;
							const ratePlan = urlSearchParams.get(
								'ratePlan',
							) as ActiveRatePlanKey;
							const { productKey, ratePlanKey } =
								internationaliseProductAndRatePlan(
									selectedInternationalisationId,
									product,
									ratePlan,
								);
							urlSearchParams.set('product', productKey);
							urlSearchParams.set('ratePlan', ratePlanKey);

							const location = `${redirectPathname}?${urlSearchParams.toString()}${
								window.location.hash
							}`;
							window.location.href = location;
						}
					}

					if (selectedCountry) {
						setCountry(selectedCountry);
					}
				}}
				error={firstError('country', errors)}
				name={`${scope}-country`}
				data-link-name={`${scope}CountrySelect : ${country}`}
			>
				<OptionForSelect value="">Select a country</OptionForSelect>
				{sortedOptions(countries)}
			</Select>

			{country === 'GB' ? (
				<PostcodeFinder
					postcode={postcodeState.postcode}
					isLoading={postcodeState.isLoading}
					error={postcodeState.error}
					results={postcodeState.results}
					onPostcodeUpdate={(postcode) => {
						setPostcode(postcode);
						setPostcodeForFinder(postcode);
					}}
					onPostcodeError={setPostcodeErrorForFinder}
					onFindAddress={onFindAddress}
					onAddressSelected={({
						lineOne,
						lineTwo,
						city,
					}: PostcodeFinderResult) => {
						setLineOne(lineOne ?? '');
						setLineTwo(lineTwo ?? '');
						setTownCity(city ?? '');
					}}
				/>
			) : null}
			<TextInput
				cssOverrides={marginBottom}
				id={`${scope}-lineOne`}
				data-qm-masking="blocklist"
				label="Address Line 1"
				type="text"
				value={lineOne ?? ''}
				onChange={(e) => setLineOne(e.target.value)}
				error={firstError('lineOne', errors)}
				name={`${scope}-lineOne`}
				maxLength={100}
				pattern={doesNotContainExtendedEmojiOrLeadingSpace}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'lineOne');
				}}
			/>
			<TextInput
				cssOverrides={marginBottom}
				id={`${scope}-lineTwo`}
				data-qm-masking="blocklist"
				label="Address Line 2"
				optional
				type="text"
				value={lineTwo ?? ''}
				onChange={(e) => setLineTwo(e.target.value)}
				error={firstError('lineTwo', errors)}
				name={`${scope}-lineTwo`}
				maxLength={100}
				pattern={doesNotContainExtendedEmojiOrLeadingSpace}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'lineTwo');
				}}
			/>
			<TextInput
				cssOverrides={marginBottom}
				id={`${scope}-city`}
				data-qm-masking="blocklist"
				label="Town/City"
				type="text"
				maxLength={40}
				value={city ?? ''}
				onChange={(e) => setTownCity(e.target.value)}
				error={firstError('city', errors)}
				name={`${scope}-city`}
				pattern={doesNotContainExtendedEmojiOrLeadingSpace}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'city');
				}}
			/>
			<MaybeSelect
				cssOverrides={[marginBottom, selectStateStyles]}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label={country === 'CA' ? 'Province/Territory' : 'State'}
				value={state}
				onChange={(e) => setState(e.target.value)}
				error={firstError('state', errors)}
				isShown={shouldShowStateDropdown(country)}
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
						country === 'CA' ? 'province/territory' : 'state'
					}`}</OptionForSelect>
					{statesForCountry(country)}
				</>
			</MaybeSelect>
			<MaybeInput
				cssOverrides={marginBottom}
				id={`${scope}-stateProvince`}
				data-qm-masking="blocklist"
				label="State"
				value={state}
				onChange={(e) => setState(e.target.value)}
				error={firstError('state', errors)}
				optional
				isShown={shouldShowStateInput(country)}
				name={`${scope}-stateProvince`}
				pattern={doesNotContainExtendedEmojiOrLeadingSpace}
				onBlur={(event) => {
					event.target.checkValidity();
				}}
				onInvalid={(event) => {
					setErrorsOnInvalid(event, 'state');
				}}
			/>
			<TextInput
				cssOverrides={marginBottom}
				id={`${scope}-postcode`}
				data-qm-masking="blocklist"
				label={country === 'US' ? 'ZIP code' : 'Postcode'}
				type="text"
				optional={isPostcodeOptional(country)}
				value={postCode}
				onChange={(e) => setPostcode(e.target.value)}
				error={firstError('postCode', errors)}
				name={`${scope}-postcode`}
				maxLength={20}
				pattern={doesNotContainExtendedEmojiOrLeadingSpace}
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
