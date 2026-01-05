import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import type { BillingStatePostcodeCountry } from './BillingAddressFields';

export type BillingAddressProps = {
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	billingStatePostcodeCountry: BillingStatePostcodeCountry;
};

export function BillingAddress({
	countries,
	checkoutSession,
	billingStatePostcodeCountry,
}: BillingAddressProps) {
	/** Billing address */
	const postcode = billingStatePostcodeCountry.billingPostcode;
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
	const [billingAddressErrors, setBillingAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const [postcodeLookupError, setPostcodeLookupError] = useState<string | null>(
		null,
	);

	return (
		<fieldset>
			<AddressFields
				scope={'billing'}
				lineOne={billingLineOne}
				lineTwo={billingLineTwo}
				city={billingCity}
				country={billingStatePostcodeCountry.billingCountry}
				state={billingStatePostcodeCountry.billingState}
				postCode={postcode}
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
				setState={billingStatePostcodeCountry.setBillingState}
				setPostcode={billingStatePostcodeCountry.setBillingPostcode}
				setCountry={billingStatePostcodeCountry.setBillingCountry}
				setPostcodeForFinder={() => {
					// no-op
				}}
				setPostcodeErrorForFinder={(error) => {
					setPostcodeLookupError(error);
				}}
				postcodeErrorForFinder={postcodeLookupError}
				setErrors={setBillingAddressErrors}
				onFindAddress={(postcode) => {
					setBillingPostcodeStateLoading(true);

					void findAddressesForPostcode(postcode)
						.then((results) => {
							setBillingPostcodeStateResults(results);
							setPostcodeLookupError(null);
						})
						.catch(() => {
							setBillingPostcodeStateResults([]);
							setPostcodeLookupError('Postcode not found');
						})
						.finally(() => {
							setBillingPostcodeStateLoading(false);
						});
				}}
			/>
		</fieldset>
	);
}
