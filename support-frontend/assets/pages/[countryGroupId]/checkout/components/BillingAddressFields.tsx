import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import type { BillingAddressProps } from './BillingAddress';
import { BillingAddress } from './BillingAddress';

export type BillingStatePostcodeCountry = {
	billingState: string;
	setBillingState: (value: string) => void;
	billingPostcode: string;
	setBillingPostcode: (value: string) => void;
	billingCountry: IsoCountry;
	setBillingCountry: (value: IsoCountry) => void;
};

type BillingAddressFieldsProps = BillingAddressProps & {
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
					billingStatePostcodeCountry={billingStatePostcodeCountry}
				/>
			)}
		</>
	);
}
