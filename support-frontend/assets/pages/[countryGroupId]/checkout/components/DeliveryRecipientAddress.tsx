import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { TextArea } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import { Legend } from 'pages/[countryGroupId]/components/form';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';

type DeliveryRecipientAddressProps = {
	countryId: IsoCountry;
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	postcode: string;
	setPostcode: (value: string) => void;
	legend: string;
	showInstructions: boolean;
	addressErrors: AddressFormFieldError[];
	setAddressErrors: React.Dispatch<
		React.SetStateAction<AddressFormFieldError[]>
	>;
};

export function DeliveryRecipientAddress({
	countryId,
	countries,
	checkoutSession,
	postcode,
	setPostcode,
	legend,
	showInstructions,
	addressErrors,
	setAddressErrors,
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
					postCode={postcode}
					countryGroupId={countryGroupId}
					countries={countries ?? {}}
					errors={addressErrors}
					postcodeState={{
						results: deliveryPostcodeStateResults,
						isLoading: deliveryPostcodeStateLoading,
						postcode,
						error: '',
					}}
					setLineOne={setDeliveryLineOne}
					setLineTwo={setDeliveryLineTwo}
					setTownCity={setDeliveryCity}
					setState={setDeliveryState}
					setPostcode={setPostcode}
					setCountry={setDeliveryCountry}
					setPostcodeForFinder={() => {
						// no-op
					}}
					setPostcodeErrorForFinder={() => {
						// no-op
					}}
					setErrors={setAddressErrors}
					onFindAddress={(postcode) => {
						setDeliveryPostcodeStateLoading(true);
						void findAddressesForPostcode(postcode).then((results) => {
							setDeliveryPostcodeStateLoading(false);
							setDeliveryPostcodeStateResults(results);
						});
					}}
				/>
			</fieldset>
			{showInstructions && (
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
