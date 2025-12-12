import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label } from '@guardian/source/react-components';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import { BillingAddress } from './BillingAddress';
import type { BillingStatePostcodeCountry } from './PersonalDetailsFields';

type BillingAddressFieldsProps = {
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	billingStatePostcodeCountry: BillingStatePostcodeCountry;
	isWeeklyGift: boolean;
};

export function BillingAddressFields({
	countries,
	checkoutSession,
	billingStatePostcodeCountry,
	isWeeklyGift,
}: BillingAddressFieldsProps) {
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	const billingLabel = `Billing address same as ${
		isWeeklyGift ? `recipient's` : 'delivery'
	} address`;
	return (
		<>
			<fieldset
				css={css`
					margin-bottom: ${space[6]}px;
				`}
			>
				<Label text="Billing address" htmlFor="billingAddressMatchesDelivery" />
				<Checkbox
					checked={billingAddressMatchesDelivery}
					value="yes"
					onChange={() => {
						setBillingAddressMatchesDelivery(!billingAddressMatchesDelivery);
					}}
					id="billingAddressMatchesDelivery"
					name="billingAddressMatchesDelivery"
					label={billingLabel}
				/>
			</fieldset>
			{!billingAddressMatchesDelivery && (
				<BillingAddress
					countries={countries}
					checkoutSession={checkoutSession}
					postcode={billingStatePostcodeCountry.billingPostcode}
					setPostcode={billingStatePostcodeCountry.setBillingPostcode}
					state={billingStatePostcodeCountry.billingState}
					setState={billingStatePostcodeCountry.setBillingState}
					billingCountry={billingStatePostcodeCountry.billingCountry}
					setBillingCountry={billingStatePostcodeCountry.setBillingCountry}
				/>
			)}
		</>
	);
}
