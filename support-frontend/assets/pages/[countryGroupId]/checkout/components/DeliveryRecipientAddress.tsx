import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { TextArea } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type {
	ActiveProductKey,
	ProductDescription,
} from 'helpers/productCatalog';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import { Legend } from 'pages/[countryGroupId]/components/form';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';

type DeliveryRecipientAddressProps = {
	countryId: IsoCountry;
	legend: string;
	checkoutSession?: CheckoutSession;
	productDescription: ProductDescription;
	productKey: ActiveProductKey;
	deliveryAddressErrors: AddressFormFieldError[];
	setDeliveryAddressErrors: React.Dispatch<
		React.SetStateAction<AddressFormFieldError[]>
	>;
	deliveryPostcode: string;
	setDeliveryPostcode: (value: string) => void;
};

export function DeliveryRecipientAddress({
	countryId,
	legend,
	checkoutSession,
	productDescription,
	productKey,
	deliveryAddressErrors,
	setDeliveryAddressErrors,
	deliveryPostcode,
	setDeliveryPostcode,
}: DeliveryRecipientAddressProps) {
	/** Delivery address */
	const [deliveryLineOne, setDeliveryLineOne] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.deliveryAddress?.lineOne,
			'',
		);
	const [deliveryLineTwo, setDeliveryLineTwo] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.deliveryAddress?.lineTwo,
			'',
		);
	const [deliveryCity, setDeliveryCity] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.addressFields.deliveryAddress?.city,
		'',
	);
	const [deliveryState, setDeliveryState] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.addressFields.deliveryAddress?.state,
		'',
	);
	const [deliveryPostcodeStateResults, setDeliveryPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [deliveryPostcodeStateLoading, setDeliveryPostcodeStateLoading] =
		useState(false);
	const [deliveryCountry, setDeliveryCountry] =
		useStateWithCheckoutSession<IsoCountry>(
			checkoutSession?.formFields.addressFields.deliveryAddress?.country,
			countryId,
		);
	const [deliveryInstructions, setDeliveryInstructions] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.deliveryInstructions,
			'',
		);

	const countryGroupId = CountryGroup.fromCountry(countryId) ?? 'International';

	return (
		<>
			<fieldset>
				<Legend>{legend}</Legend>
				<AddressFields
					scope={'delivery'}
					lineOne={deliveryLineOne}
					lineTwo={deliveryLineTwo}
					city={deliveryCity}
					country={deliveryCountry}
					state={deliveryState}
					postCode={deliveryPostcode}
					countryGroupId={countryGroupId}
					countries={productDescription.deliverableTo ?? {}}
					errors={deliveryAddressErrors}
					postcodeState={{
						results: deliveryPostcodeStateResults,
						isLoading: deliveryPostcodeStateLoading,
						postcode: deliveryPostcode,
						error: '',
					}}
					setLineOne={(lineOne) => {
						setDeliveryLineOne(lineOne);
					}}
					setLineTwo={(lineTwo) => {
						setDeliveryLineTwo(lineTwo);
					}}
					setTownCity={(city) => {
						setDeliveryCity(city);
					}}
					setState={(state) => {
						setDeliveryState(state);
					}}
					setPostcode={(postcode) => {
						setDeliveryPostcode(postcode);
					}}
					setCountry={(country) => {
						setDeliveryCountry(country);
					}}
					setPostcodeForFinder={() => {
						// no-op
					}}
					setPostcodeErrorForFinder={() => {
						// no-op
					}}
					setErrors={(errors) => {
						setDeliveryAddressErrors(errors);
					}}
					onFindAddress={(postcode) => {
						setDeliveryPostcodeStateLoading(true);
						void findAddressesForPostcode(postcode).then((results) => {
							setDeliveryPostcodeStateLoading(false);
							setDeliveryPostcodeStateResults(results);
						});
					}}
				/>
			</fieldset>
			{productKey === 'HomeDelivery' && (
				<fieldset
					css={css`
						margin-bottom: ${space[6]}px;
					`}
				>
					<TextArea
						id="deliveryInstructions"
						data-qm-masking="blocklist"
						name="deliveryInstructions"
						label="Delivery instructions"
						autoComplete="new-password" // Using "new-password" here because "off" isn't working in chrome
						supporting="Please let us know any details to help us find your property (door colour, any access issues) and the best place to leave your newspaper. For example, 'Front door - red - on Crinan Street, put through letterbox'"
						onChange={(event) => {
							setDeliveryInstructions(event.target.value);
						}}
						value={deliveryInstructions}
						optional
					/>
				</fieldset>
			)}
		</>
	);
}
