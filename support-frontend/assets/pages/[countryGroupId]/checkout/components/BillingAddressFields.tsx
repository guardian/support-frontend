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
};

export function BillingAddressFields({
	countryId,
	countries,
	checkoutSession,
	billingStatePostcode,
}: BillingAddressFieldsProps) {
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	console.log('** countryId', countryId);
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
					label="Billing address same as delivery address"
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
