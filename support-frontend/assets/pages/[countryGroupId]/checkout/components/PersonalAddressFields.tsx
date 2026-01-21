import type { IsoCountry } from '@modules/internationalisation/country';
import type { AddressFormFieldError } from 'components/subscriptionCheckouts/address/addressFields';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { DeliveryAgentsSelect } from 'pages/paper-subscription-checkout/components/deliveryAgentsSelect';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import type { DeliveryAgentsResponse } from '../helpers/getDeliveryAgents';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import type { BillingStatePostcodeCountry } from './BillingAddressFields';
import { BillingAddressFields } from './BillingAddressFields';
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
	billingStatePostcodeCountry?: BillingStatePostcodeCountry;
	isWeeklyGift?: boolean;
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
	billingStatePostcodeCountry,
	isWeeklyGift = false,
}: PersonalAddressFieldsProps) {
	const legendDelivery = billingStatePostcodeCountry
		? `2. Delivery address`
		: `3. Gift recipient's address`;
	const legendOutsideM25 = `${
		billingStatePostcodeCountry ? 3 : 4
	}. Delivery Agent`;

	return (
		<>
			<DeliveryRecipientAddress
				countryId={countryId}
				countries={countries}
				checkoutSession={checkoutSession}
				postcode={deliveryPostcode}
				setPostcode={setDeliveryPostcode}
				legend={legendDelivery}
				showInstructions={productKey === 'HomeDelivery'}
				addressErrors={deliveryAddressErrors}
				setAddressErrors={setDeliveryAddressErrors}
			/>
			{billingStatePostcodeCountry && (
				<BillingAddressFields
					countries={countries}
					checkoutSession={checkoutSession}
					billingStatePostcodeCountry={billingStatePostcodeCountry}
					isWeeklyGift={isWeeklyGift}
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
