import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Checkbox, Label, TextArea } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
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

type PersonalAddressFieldsProps = {
	isWeeklyGift: boolean;
	checkoutSession?: CheckoutSession;
	productDescription: ProductDescription;
	countryGroupId: CountryGroupId;
	countryId: IsoCountry;
	productKey: ActiveProductKey;
	legendStartNumber: number;
	billingPostcode: string;
	setBillingPostcode: (value: string) => void;
	billingState: string;
	setBillingState: (value: string) => void;
	deliveryPostcodeIsOutsideM25: boolean;
	chosenDeliveryAgent: number | undefined;
	setChosenDeliveryAgent: (value: number | undefined) => void;
	deliveryAgents: DeliveryAgentsResponse | undefined;
	deliveryAgentError: string | undefined;
	setDeliveryAgentError: (value: string | undefined) => void;
	deliveryAddressErrors: AddressFormFieldError[];
	setDeliveryAddressErrors: React.Dispatch<
		React.SetStateAction<AddressFormFieldError[]>
	>;
	deliveryPostcode: string;
	setDeliveryPostcode: (value: string) => void;
};

export function PersonalAddressFields({
	isWeeklyGift,
	checkoutSession,
	productDescription,
	countryGroupId,
	countryId,
	productKey,
	legendStartNumber,
	billingPostcode,
	setBillingPostcode,
	billingState,
	setBillingState,
	deliveryPostcodeIsOutsideM25,
	chosenDeliveryAgent,
	setChosenDeliveryAgent,
	deliveryAgents,
	deliveryAgentError,
	setDeliveryAgentError,
	deliveryAddressErrors,
	setDeliveryAddressErrors,
	deliveryPostcode,
	setDeliveryPostcode,
}: PersonalAddressFieldsProps) {
	/** Delivery Instructions */
	const [deliveryInstructions, setDeliveryInstructions] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.deliveryInstructions,
			'',
		);

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

	/** Billing address */
	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useStateWithCheckoutSession<boolean>(
			checkoutSession?.formFields.billingAddressMatchesDelivery,
			true,
		);
	const [billingLineOne, setBillingLineOne] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.billingAddress.lineOne,
			'',
		);
	const [billingLineTwo, setBillingLineTwo] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.billingAddress.lineTwo,
			'',
		);
	const [billingCity, setBillingCity] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.addressFields.billingAddress.city,
		'',
	);
	const [billingPostcodeStateResults, setBillingPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);
	const [billingCountry, setBillingCountry] =
		useStateWithCheckoutSession<IsoCountry>(
			checkoutSession?.formFields.addressFields.billingAddress.country,
			countryId,
		);
	const [billingAddressErrors, setBillingAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	/** Gift recipient address */
	const [recipientPostcode, setRecipientPostcode] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLineOne, setRecipientLineOne] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLineTwo, setRecipientLineTwo] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientCity, setRecipientCity] = useStateWithCheckoutSession<string>(
		undefined,
		'',
	);
	const [recipientState, setRecipientState] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientPostcodeStateResults, setRecipientPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [recipientPostcodeStateLoading, setRecipientPostcodeStateLoading] =
		useState(false);
	const [recipientCountry, setRecipientCountry] =
		useStateWithCheckoutSession<IsoCountry>(undefined, countryId);
	const [recipientAddressErrors, setRecipientAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);
	return (
		<>
			{isWeeklyGift && productDescription.deliverableTo && (
				<>
					<fieldset>
						<Legend>{`${
							legendStartNumber + 1
						}. Gift recipient's address`}</Legend>
						<AddressFields
							scope={'recipient'}
							lineOne={recipientLineOne}
							lineTwo={recipientLineTwo}
							city={recipientCity}
							country={recipientCountry}
							state={recipientState}
							postCode={recipientPostcode}
							countryGroupId={countryGroupId}
							countries={productDescription.deliverableTo}
							errors={recipientAddressErrors}
							postcodeState={{
								results: recipientPostcodeStateResults,
								isLoading: recipientPostcodeStateLoading,
								postcode: recipientPostcode,
								error: '',
							}}
							setLineOne={(lineOne) => {
								setRecipientLineOne(lineOne);
							}}
							setLineTwo={(lineTwo) => {
								setRecipientLineTwo(lineTwo);
							}}
							setTownCity={(city) => {
								setRecipientCity(city);
							}}
							setState={(state) => {
								setRecipientState(state);
							}}
							setPostcode={(postcode) => {
								setRecipientPostcode(postcode);
							}}
							setCountry={(country) => {
								setRecipientCountry(country);
							}}
							setPostcodeForFinder={() => {
								// no-op
							}}
							setPostcodeErrorForFinder={() => {
								// no-op
							}}
							setErrors={(errors) => {
								setRecipientAddressErrors(errors);
							}}
							onFindAddress={(postcode) => {
								setRecipientPostcodeStateLoading(true);
								void findAddressesForPostcode(postcode).then((results) => {
									setRecipientPostcodeStateLoading(false);
									setRecipientPostcodeStateResults(results);
								});
							}}
						/>
					</fieldset>
				</>
			)}
			{productDescription.deliverableTo && (
				<>
					{!isWeeklyGift && (
						<>
							<fieldset>
								<Legend>{`${legendStartNumber + 1}. Delivery address`}</Legend>
								<AddressFields
									scope={'delivery'}
									lineOne={deliveryLineOne}
									lineTwo={deliveryLineTwo}
									city={deliveryCity}
									country={deliveryCountry}
									state={deliveryState}
									postCode={deliveryPostcode}
									countryGroupId={countryGroupId}
									countries={productDescription.deliverableTo}
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
					)}
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
						<fieldset>
							<AddressFields
								scope={'billing'}
								lineOne={billingLineOne}
								lineTwo={billingLineTwo}
								city={billingCity}
								country={billingCountry}
								state={billingState}
								postCode={billingPostcode}
								countryGroupId={countryGroupId}
								countries={productDescription.deliverableTo}
								errors={billingAddressErrors}
								postcodeState={{
									results: billingPostcodeStateResults,
									isLoading: billingPostcodeStateLoading,
									postcode: billingPostcode,
									error: '',
								}}
								setLineOne={(lineOne) => {
									setBillingLineOne(lineOne);
								}}
								setLineTwo={(lineTwo) => {
									setBillingLineTwo(lineTwo);
								}}
								setTownCity={(city) => {
									setBillingCity(city);
								}}
								setState={(state) => {
									setBillingState(state);
								}}
								setPostcode={(postcode) => {
									setBillingPostcode(postcode);
								}}
								setCountry={(country) => {
									setBillingCountry(country);
								}}
								setPostcodeForFinder={() => {
									// no-op
								}}
								setPostcodeErrorForFinder={() => {
									// no-op
								}}
								setErrors={(errors) => {
									setBillingAddressErrors(errors);
								}}
								onFindAddress={(postcode) => {
									setBillingPostcodeStateLoading(true);
									void findAddressesForPostcode(postcode).then((results) => {
										setBillingPostcodeStateLoading(false);
										setBillingPostcodeStateResults(results);
									});
								}}
							/>
						</fieldset>
					)}

					<CheckoutDivider spacing="loose" />
				</>
			)}
			{deliveryPostcodeIsOutsideM25 && (
				<FormSection>
					<Legend>{`${legendStartNumber + 2}.  Delivery Agent`}</Legend>
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
	);
}
