import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { DeliveryAgentsSelect } from 'pages/paper-subscription-checkout/components/deliveryAgentsSelect';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import type { DeliveryAgentsResponse } from '../helpers/getDeliveryAgents';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import { BillingAddress } from './BillingAddress';
import { DeliveryRecipientAddress } from './DeliveryRecipientAddress';

type PersonalAddressFieldsProps = {
	countryId: IsoCountry;
	countries?: Record<string, string>;
	checkoutSession?: CheckoutSession;
	productKey: ActiveProductKey;
	deliveryPostcodeIsOutsideM25: boolean;
	deliveryPostcode: string;
	setDeliveryPostcode: (value: string) => void;
	chosenDeliveryAgent: number | undefined;
	setChosenDeliveryAgent: (value: number | undefined) => void;
	deliveryAgents: DeliveryAgentsResponse | undefined;
	deliveryAgentError: string | undefined;
	setDeliveryAgentError: (value: string | undefined) => void;
	deliveryAddressErrors: AddressFormFieldError[];
	setDeliveryAddressErrors: React.Dispatch<
		React.SetStateAction<AddressFormFieldError[]>
	>;
	billingPostcode: string;
	setBillingPostcode: (value: string) => void;
	billingState: string;
	setBillingState: (value: string) => void;
	isWeeklyGift: boolean;
};

export function PersonalAddressFields({
	countryId,
	countries,
	checkoutSession,
	productKey,
	deliveryPostcodeIsOutsideM25,
	deliveryPostcode,
	setDeliveryPostcode,
	chosenDeliveryAgent,
	setChosenDeliveryAgent,
	deliveryAgents,
	deliveryAgentError,
	setDeliveryAgentError,
	deliveryAddressErrors,
	setDeliveryAddressErrors,
	billingPostcode,
	setBillingPostcode,
	billingState,
	setBillingState,
	isWeeklyGift,
}: PersonalAddressFieldsProps) {
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	const legendDelivery = `${isWeeklyGift ? 4 : 2}. ${
		isWeeklyGift ? `Gift recipient's address` : `Delivery address`
	}`;
	const legendOutsideM25 = `${isWeeklyGift ? 5 : 3}.  Delivery Agent`;

	return (
		<>
			<DeliveryRecipientAddress
				countryId={countryId}
				countries={countries}
				checkoutSession={checkoutSession}
				legend={legendDelivery}
				productKey={productKey}
				deliveryAddressErrors={deliveryAddressErrors}
				setDeliveryAddressErrors={setDeliveryAddressErrors}
				postcode={deliveryPostcode}
				setPostcode={setDeliveryPostcode}
			/>
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
					postcode={billingPostcode}
					setPostcode={setBillingPostcode}
					state={billingState}
					setState={setBillingState}
				/>
			)}
			{deliveryPostcodeIsOutsideM25 && (
				<FormSection>
					<Legend>{legendOutsideM25}</Legend>
					<DeliveryAgentsSelect
						chosenDeliveryAgent={chosenDeliveryAgent}
						deliveryAgentsResponse={deliveryAgents}
						setDeliveryAgent={(agent: number | undefined) => {
							setChosenDeliveryAgent(agent);
							setDeliveryAgentError(undefined);
						}}
						formErrors={
							deliveryAgentError !== undefined
								? [
										{
											field: 'deliveryProvider',
											message: deliveryAgentError,
										},
								  ]
								: []
						}
						deliveryAddressErrors={[]}
					/>
				</FormSection>
			)}
			<CheckoutDivider spacing="loose" />
		</>
	);
}
