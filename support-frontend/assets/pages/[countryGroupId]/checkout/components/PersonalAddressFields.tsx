import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type {
	ActiveProductKey,
	ProductDescription,
} from 'helpers/productCatalog';
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
	legend: string;
	legendOutsideM25: string;
	checkoutSession?: CheckoutSession;
	productDescription: ProductDescription;
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
};

export function PersonalAddressFields({
	countryId,
	legend,
	legendOutsideM25,
	checkoutSession,
	productDescription,
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
}: PersonalAddressFieldsProps) {
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	return (
		<>
			{productDescription.deliverableTo && (
				<>
					<DeliveryRecipientAddress
						countryId={countryId}
						legend={legend}
						checkoutSession={checkoutSession}
						productDescription={productDescription}
						productKey={productKey}
						deliveryAddressErrors={deliveryAddressErrors}
						setDeliveryAddressErrors={setDeliveryAddressErrors}
						deliveryPostcode={deliveryPostcode}
						setDeliveryPostcode={setDeliveryPostcode}
					/>
					<fieldset
						css={css`
							margin-bottom: ${space[6]}px;
						`}
					>
						<Label
							text="Billing address"
							htmlFor="billingAddressMatchesDelivery"
						/>
						<Checkbox
							checked={billingAddressMatchesDelivery}
							value="yes"
							onChange={() => {
								setBillingAddressMatchesDelivery(
									!billingAddressMatchesDelivery,
								);
							}}
							id="billingAddressMatchesDelivery"
							name="billingAddressMatchesDelivery"
							label="Billing address same as delivery address"
						/>
					</fieldset>
					{!billingAddressMatchesDelivery && (
						<BillingAddress
							checkoutSession={checkoutSession}
							productDescription={productDescription}
							countryId={countryId}
							billingPostcode={billingPostcode}
							setBillingPostcode={setBillingPostcode}
							billingState={billingState}
							setBillingState={setBillingState}
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
				</>
			)}
			<CheckoutDivider spacing="loose" />
		</>
	);
}
