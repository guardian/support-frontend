import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import { BillingAddress } from './BillingAddress';
import type { BillingStatePostcode } from './PersonalDetailsFields';

type BillingAddressFieldsProps = {
	countryId: IsoCountry;
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	billingStatePostcode: BillingStatePostcode;
	isWeeklyGift: boolean;
};

export function BillingAddressFields({
	countryId,
	countries,
	checkoutSession,
	billingStatePostcode,
	isWeeklyGift,
}: BillingAddressFieldsProps) {
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	const billingLabel = `Billing address same as ${
		isWeeklyGift ? `recipients's` : 'delivery'
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
					countryId={countryId}
					countries={countries}
					checkoutSession={checkoutSession}
					postcode={billingStatePostcode.billingPostcode}
					setPostcode={billingStatePostcode.setBillingPostcode}
					state={billingStatePostcode.billingState}
					setState={billingStatePostcode.setBillingState}
				/>
			)}
		</>
	);
}
