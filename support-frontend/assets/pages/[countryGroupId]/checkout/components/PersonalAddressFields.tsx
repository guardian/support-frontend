import type { IsoCountry } from '@modules/internationalisation/country';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { DeliveryAgentsSelect } from 'pages/paper-subscription-checkout/components/deliveryAgentsSelect';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import type { DeliveryAgentsResponse } from '../helpers/getDeliveryAgents';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { BillingAddressFields } from './BillingAddressFields';
import { DeliveryRecipientAddress } from './DeliveryRecipientAddress';
import type { BillingStatePostcode } from './PersonalDetailsFields';

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
	billingStatePostcode?: BillingStatePostcode;
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
	billingStatePostcode,
}: PersonalAddressFieldsProps) {
	const legendDelivery = billingStatePostcode
		? `2. Delivery address`
		: `3. Gift recipient's address`;
	const legendOutsideM25 = `${billingStatePostcode ? 3 : 4}. Delivery Agent`;

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
			{billingStatePostcode && (
				<BillingAddressFields
					countryId={countryId}
					countries={countries}
					checkoutSession={checkoutSession}
					billingStatePostcode={billingStatePostcode}
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
