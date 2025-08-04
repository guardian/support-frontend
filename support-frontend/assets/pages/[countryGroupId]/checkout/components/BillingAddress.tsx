import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { ProductDescription } from 'helpers/productCatalog';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';

type BillingAddressProps = {
	checkoutSession?: CheckoutSession;
	productDescription: ProductDescription;
	countryId: IsoCountry;
	billingPostcode: string;
	setBillingPostcode: (value: string) => void;
	billingState: string;
	setBillingState: (value: string) => void;
};

export function BillingAddress({
	checkoutSession,
	productDescription,
	countryId,
	billingPostcode,
	setBillingPostcode,
	billingState,
	setBillingState,
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
				state={billingState}
				postCode={billingPostcode}
				countryGroupId={countryGroupId}
				countries={productDescription.deliverableTo ?? {}}
				errors={billingAddressErrors}
				postcodeState={{
					results: billingPostcodeStateResults,
					isLoading: billingPostcodeStateLoading,
					postcode: billingPostcode,
					error: '',
				}}
				setLineOne={(lineOne) => {
					setBillingLineOne(lineOne);
				}}
				setLineTwo={(lineTwo) => {
					setBillingLineTwo(lineTwo);
				}}
				setTownCity={(city) => {
					setBillingCity(city);
				}}
				setState={(state) => {
					setBillingState(state);
				}}
				setPostcode={(postcode) => {
					setBillingPostcode(postcode);
				}}
				setCountry={(country) => {
					setBillingCountry(country);
				}}
				setPostcodeForFinder={() => {
					// no-op
				}}
				setPostcodeErrorForFinder={() => {
					// no-op
				}}
				setErrors={(errors) => {
					setBillingAddressErrors(errors);
				}}
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
