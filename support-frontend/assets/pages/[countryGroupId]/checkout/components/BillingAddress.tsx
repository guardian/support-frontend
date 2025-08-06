import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';

type BillingAddressProps = {
	countryId: IsoCountry;
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	postcode: string;
	setPostcode: (value: string) => void;
	state: string;
	setState: (value: string) => void;
};

export function BillingAddress({
	countries,
	countryId,
	checkoutSession,
	postcode,
	setPostcode,
	state,
	setState,
}: BillingAddressProps) {
	/** Billing address */
	const [billingLineOne, setBillingLineOne] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.billingAddress.lineOne,
			'',
		);
	const [billingLineTwo, setBillingLineTwo] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.billingAddress.lineTwo,
			'',
		);
	const [billingCity, setBillingCity] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.addressFields.billingAddress.city,
		'',
	);
	const [billingPostcodeStateResults, setBillingPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);
	const [billingCountry, setBillingCountry] =
		useStateWithCheckoutSession<IsoCountry>(
			checkoutSession?.formFields.addressFields.billingAddress.country,
			countryId,
		);
	const [billingAddressErrors, setBillingAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const countryGroupId = CountryGroup.fromCountry(countryId) ?? 'International';
	return (
		<fieldset>
			<AddressFields
				scope={'billing'}
				lineOne={billingLineOne}
				lineTwo={billingLineTwo}
				city={billingCity}
				country={billingCountry}
				state={state}
				postCode={postcode}
				countryGroupId={countryGroupId}
				countries={countries ?? {}}
				errors={billingAddressErrors}
				postcodeState={{
					results: billingPostcodeStateResults,
					isLoading: billingPostcodeStateLoading,
					postcode: postcode,
					error: '',
				}}
				setLineOne={setBillingLineOne}
				setLineTwo={setBillingLineTwo}
				setTownCity={setBillingCity}
				setState={setState}
				setPostcode={setPostcode}
				setCountry={setBillingCountry}
				setPostcodeForFinder={() => {
					// no-op
				}}
				setPostcodeErrorForFinder={() => {
					// no-op
				}}
				setErrors={setBillingAddressErrors}
				onFindAddress={(postcode) => {
					setBillingPostcodeStateLoading(true);
					void findAddressesForPostcode(postcode).then((results) => {
						setBillingPostcodeStateLoading(false);
						setBillingPostcodeStateResults(results);
					});
				}}
			/>
		</fieldset>
	);
}
