import { css } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	Column,
	Columns,
	Container,
	Radio,
	RadioGroup,
	TextInput,
} from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import {
	CardNumberElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { parse, picklist } from 'valibot'; // 1.54 kB
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { PageScaffold } from 'components/page/pageScaffold';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { StateSelect } from 'components/personalDetails/stateSelect';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import Signout from 'components/signout/signout';
import { StripeElements } from 'components/stripe/stripeElements';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import type {
	RegularPaymentRequest,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	AmazonPay,
	DirectDebit,
	isPaymentMethod,
	type PaymentMethod,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import { getStripeKey } from 'helpers/forms/stripe';
import { validateWindowGuardian } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import { productCatalogDescription } from 'helpers/productCatalog';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { renderPage } from 'helpers/rendering/render';
import { get } from 'helpers/storage/cookie';
import {
	getOphanIds,
	getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';

/** App config - this is config that should persist throughout the app */
validateWindowGuardian(window.guardian);

const isTestUser = true;
const geoIds = ['uk', 'us', 'eu', 'au', 'nz', 'ca', 'int'] as const;
const GeoIdSchema = picklist(geoIds);
const geoId = parse(GeoIdSchema, window.location.pathname.split('/')[1]);

let currency: Currency;
let currencyKey: keyof typeof currencies;
let countryGroupId: CountryGroupId;
switch (geoId) {
	case 'uk':
		currency = currencies.GBP;
		currencyKey = 'GBP';
		countryGroupId = 'GBPCountries';
		break;
	case 'us':
		currency = currencies.USD;
		currencyKey = 'USD';
		countryGroupId = 'UnitedStates';
		break;
	case 'au':
		currency = currencies.AUD;
		currencyKey = 'AUD';
		countryGroupId = 'AUDCountries';
		break;
	case 'eu':
		currency = currencies.EUR;
		currencyKey = 'EUR';
		countryGroupId = 'EURCountries';
		break;
	case 'nz':
		currency = currencies.NZD;
		currencyKey = 'NZD';
		countryGroupId = 'NZDCountries';
		break;
	case 'ca':
		currency = currencies.CAD;
		currencyKey = 'CAD';
		countryGroupId = 'Canada';
		break;
	case 'int':
		currency = currencies.USD;
		currencyKey = 'USD';
		countryGroupId = 'International';
		break;
}

const isSignedIn = !!get('GU_U');
const countryId: IsoCountry =
	CountryHelper.fromString(get('GU_country') ?? 'GB') ?? 'GB';

const productCatalog = window.guardian.productCatalog;

/** Page config - this is setup specifically for the checkout page */
function isNumeric(str: string) {
	return !isNaN(parseFloat(str));
}

const searchParams = new URLSearchParams(window.location.search);
const queryAmount = searchParams.get('amount');
const query = {
	product: searchParams.get('product') ?? '',
	ratePlan: searchParams.get('ratePlan') ?? '',
	amount:
		queryAmount && isNumeric(queryAmount) ? parseFloat(queryAmount) : undefined,
};

/** Page styles - styles used specifically for the checkout page */
const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans.medium()};
	padding-top: ${space[2]}px;
`;

const secureTransactionIndicator = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

const legend = css`
	margin-bottom: ${space[3]}px;
	${headline.xsmall({ fontWeight: 'bold' })};
	${from.tablet} {
		font-size: 28px;
	}
`;

const validPaymentMethods = [
	query.product !== 'Contribution' && countryGroupId === 'EURCountries' && Sepa,
	query.product !== 'Contribution' && countryId === 'GB' && DirectDebit,
	Stripe,
	PayPal,
	countryId === 'US' && AmazonPay,
].filter(isPaymentMethod);

const stripeAccount = query.product !== 'Contribution' ? 'REGULAR' : 'ONE_OFF';
const stripePublicKey = getStripeKey(
	stripeAccount,
	countryId,
	currencyKey,
	isTestUser,
);

/**
 * Product config - we check that the querystring returns a product, ratePlan and price
 */
const productId = query.product in productCatalog ? query.product : undefined;
const product = productId ? productCatalog[query.product] : undefined;
const ratePlan = product?.ratePlans[query.ratePlan];
const price = ratePlan?.pricing[currencyKey];
const productDescription = productId
	? productCatalogDescription[productId]
	: undefined;
const ratePlanDescription = productDescription?.ratePlans[query.ratePlan];

/**
 * This is the data structure used by the `/subscribe/create` endpoint.
 *
 * This must match the types in `CreateSupportWorkersRequest#product`
 * and readerRevenueApis - `RegularPaymentRequest#product`.
 *
 * We might be able to defer this to the backend.
 */
let productFields: RegularPaymentRequest['product'] | undefined;
if (ratePlanDescription) {
	if (productId === 'Contribution') {
		productFields = {
			productType: 'Contribution',
			currency: currencyKey,
			billingPeriod: ratePlanDescription.billingPeriod,
			amount: query.amount ?? 0,
		};
	} else if (productId === 'SupporterPlus') {
		productFields = {
			productType: 'SupporterPlus',
			currency: currencyKey,
			billingPeriod: ratePlanDescription.billingPeriod,
			amount: query.amount ?? 0,
		};
	} else if (productId === 'GuardianWeeklyDomestic') {
		productFields = {
			productType: 'GuardianWeekly',
			currency: currencyKey,
			fulfilmentOptions: 'Domestic',
			billingPeriod: ratePlanDescription.billingPeriod,
		};
	} else if (productId === 'GuardianWeeklyRestOfWorld') {
		productFields = {
			productType: 'GuardianWeekly',
			fulfilmentOptions: 'RestOfWorld',
			currency: currencyKey,
			billingPeriod: ratePlanDescription.billingPeriod,
		};
	} else if (productId === 'DigitalSubscription') {
		productFields = {
			productType: 'DigitalPack',
			currency: currencyKey,
			billingPeriod: ratePlanDescription.billingPeriod,
			// TODO - this needs filling in properly, I am not sure where this value comes from
			readerType: 'Direct',
		};
	} else if (
		productId === 'NationalDelivery' ||
		productId === 'SubscriptionCard' ||
		productId === 'HomeDelivery'
	) {
		productFields = {
			productType: 'Paper',
			currency: currencyKey,
			billingPeriod: ratePlanDescription.billingPeriod,
			// TODO - this needs filling in properly
			fulfilmentOptions: NoFulfilmentOptions,
			productOptions: NoProductOptions,
		};
	}
}

/** These are just some values needed for rendering */
let paymentFrequency: 'year' | 'month' | 'quarter';
if (ratePlanDescription?.billingPeriod === 'Annual') {
	paymentFrequency = 'year';
} else if (ratePlanDescription?.billingPeriod === 'Monthly') {
	paymentFrequency = 'month';
} else {
	paymentFrequency = 'quarter';
}

export function Checkout() {
	if (
		/** These are all the things we need to parse the page */
		!(
			product &&
			productDescription &&
			ratePlan &&
			ratePlanDescription &&
			price &&
			productFields
		)
	) {
		return (
			<div>
				Could not find product: {query.product} ratePlan: {query.ratePlan}
			</div>
		);
	}

	const showStateSelect =
		query.product !== 'Contribution' &&
		(countryId === 'US' || countryId === 'CA' || countryId === 'AU');

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
		null,
	);

	const stripe = useStripe();
	const elements = useElements();
	const cardElement = elements?.getElement(CardNumberElement);
	const [stripeClientSecret, setStripeClientSecret] = useState<string>();

	const [recaptchaToken, setRecaptchaToken] = useState<string>();

	/** Personal details */
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');

	/** Delivery and billing addresses */
	const [deliveryPostcode, setDeliveryPostcode] = useState('');
	const [deliveryLineOne, setDeliveryLineOne] = useState('');
	const [deliveryLineTwo, setDeliveryLineTwo] = useState('');
	const [deliveryCity, setDeliveryCity] = useState('');
	const [deliveryState, setDeliveryState] = useState('');
	const [deliveryPostcodeStateResults, setDeliveryPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [deliveryPostcodeStateLoading, setDeliveryPostcodeStateLoading] =
		useState(false);
	const [deliveryCountry, setDeliveryCountry] = useState(countryId);

	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useState(true);

	const [billingPostcode, setBillingPostcode] = useState('');
	const [billingLineOne, setBillingLineOne] = useState('');
	const [billingLineTwo, setBillingLineTwo] = useState('');
	const [billingCity, setBillingCity] = useState('');
	const [billingState, setBillingState] = useState('');
	const [billingPostcodeStateResults, setBillingPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);
	const [billingCountry, setBillingCountry] = useState(countryId);

	/** Direct debit details */
	const [accountHolderName, setAccountHolderName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [sortCode, setSortCode] = useState('');
	const [accountHolderConfirmation, setAccountHolderConfirmation] =
		useState(false);

	const formOnSubmit = async (formData: FormData) => {
		/**
		 * The validation for this is currently happening on the client side form validation
		 * So we'll assume strings are not null.
		 * see: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
		 */

		/** Form: Personal data */
		const personalData = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
		};

		/**
		 * FormData: address
		 * `billingAddress` is required for all products, but we only ever need to the country field populated.
		 *
		 * For products that have a `deliveryAddress`, we collect that and either copy it in `billingAddress`
		 * or allow a person to enter it manually.
		 */
		let billingAddress;
		let deliveryAddress;
		if (productDescription.deliverableTo) {
			deliveryAddress = {
				lineOne: formData.get('delivery-lineOne') as string,
				lineTwo: formData.get('delivery-lineTwo') as string,
				city: formData.get('delivery-city') as string,
				state: formData.get('delivery-state') as string,
				postCode: formData.get('delivery-postcode') as string,
				country: formData.get('country') as IsoCountry,
			};

			const billingAddressMatchesDelivery =
				formData.get('billingAddressMatchesDelivery') === 'yes';

			billingAddress = !billingAddressMatchesDelivery
				? {
						lineOne: formData.get('billing-lineOne') as string,
						lineTwo: formData.get('billing-lineTwo') as string,
						city: formData.get('billing-city') as string,
						state: formData.get('billing-state') as string,
						postCode: formData.get('billing-postcode') as string,
						country: formData.get('country') as IsoCountry,
				  }
				: deliveryAddress;
		} else {
			billingAddress = { country: formData.get('country') as IsoCountry };
			deliveryAddress = undefined;
		}

		/** FormData: `paymentFields` */
		let paymentFields;
		if (
			paymentMethod === 'Stripe' &&
			stripe &&
			cardElement &&
			stripeClientSecret
		) {
			if (productId === 'Contribution') {
				// const handle3DS = (clientSecret: string) => {
				// 	trackComponentLoad('stripe-3ds');
				// 	return stripe.handleCardAction(clientSecret);
				// };

				const stripePaymentMethodResult = await stripe.createPaymentMethod({
					type: 'card',
					card: cardElement,
					billing_details: {
						address: {
							postal_code: billingPostcode,
						},
					},
				});

				if (stripePaymentMethodResult.error) {
					// TODO - error handling
					console.error(stripePaymentMethodResult.error);
				} else {
					paymentFields = {
						stripePublicKey,
						recaptchaToken: recaptchaToken,
						stripePaymentType: 'StripeCheckout' as StripePaymentMethod,
						paymentMethod: stripePaymentMethodResult.paymentMethod.id,
					};
				}
			} else {
				const stripeSetupIntentResult = await stripe.confirmCardSetup(
					stripeClientSecret,
					{
						payment_method: {
							card: cardElement,
						},
					},
				);

				if (stripeSetupIntentResult.error) {
					// TODO - error handling
					console.error(stripeSetupIntentResult.error);
				} else if (stripeSetupIntentResult.setupIntent.payment_method) {
					paymentFields = {
						stripePublicKey,
						recaptchaToken: recaptchaToken,
						stripePaymentType: 'StripeCheckout' as StripePaymentMethod,
						paymentMethod: stripeSetupIntentResult.setupIntent
							.payment_method as string,
					};
				}
			}
		}

		if (paymentMethod === 'DirectDebit') {
			paymentFields = {
				accountHolderName: formData.get('accountHolderName') as string,
				accountNumber: formData.get('accountNumber') as string,
				sortCode: formData.get('sortCode') as string,
				recaptchaToken,
			};
		}

		/** Form: tracking data  */
		const ophanIds = getOphanIds();
		const referrerAcquisitionData = getReferrerAcquisitionData();

		if (paymentFields && productFields) {
			/** TODO - Remove this Omit to make the data valid to the endpoint */
			const createSupportWorkersRequest: Omit<
				RegularPaymentRequest,
				'firstDeliveryDate' | 'supportAbTests' | 'debugInfo'
			> = {
				...personalData,
				billingAddress,
				deliveryAddress,
				paymentFields,
				ophanIds,
				referrerAcquisitionData,
				product: productFields,
			};
			const createSubscriptionResult = await fetch('/subscribe/create', {
				method: 'POST',
				body: JSON.stringify(createSupportWorkersRequest),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// TODO - pass onto the thank you page
			console.info('createSubscriptionResult', createSubscriptionResult);
		}
	};

	return (
		<PageScaffold
			header={<Header></Header>}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading withTopBorder={true}></CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns cssOverrides={columns} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<SecureTransactionIndicator
							align="center"
							theme="light"
							cssOverrides={secureTransactionIndicator}
						/>
						<Box cssOverrides={shorterBoxMargin}>
							<BoxContents>
								<ContributionsOrderSummary
									description={productDescription.label}
									paymentFrequency={paymentFrequency}
									amount={price}
									currency={currency}
									checkListData={[]}
									onCheckListToggle={(isOpen) => {
										trackComponentClick(
											`contribution-order-summary-${
												isOpen ? 'opened' : 'closed'
											}`,
										);
									}}
									enableCheckList={true}
									tsAndCs={null}
								/>
							</BoxContents>
						</Box>
						<form
							action="/contribute/recurring/create"
							method="POST"
							onSubmit={(event) => {
								event.preventDefault();
								const form = event.currentTarget;
								const formData = new FormData(form);
								/** we defer this to an external function as a lot of the payment methods use async */
								void formOnSubmit(formData);

								return false;
							}}
						>
							<Box cssOverrides={shorterBoxMargin}>
								<BoxContents>
									<PersonalDetails
										email={email}
										firstName={firstName}
										lastName={lastName}
										isSignedIn={isSignedIn}
										hideNameFields={query.product === 'Contribution'}
										onEmailChange={(email) => {
											setEmail(email);
										}}
										onFirstNameChange={(firstName) => {
											setFirstName(firstName);
										}}
										onLastNameChange={(lastName) => {
											setLastName(lastName);
										}}
										errors={{}}
										signOutLink={<Signout isSignedIn={isSignedIn} />}
										contributionState={
											showStateSelect && (
												<StateSelect
													countryId={countryId}
													state={'STATE'}
													onStateChange={() => {
														//  no-op
													}}
													error={undefined}
												/>
											)
										}
										contributionZipcode={
											countryId === 'US' ? (
												<div>
													<TextInput
														id="zipCode"
														name="zip-code"
														label="ZIP code"
														value={''}
														error={undefined}
														onChange={() => {
															//  no-op
														}}
													/>
												</div>
											) : undefined
										}
										hideDetailsHeading={true}
										overrideHeadingCopy="1. Your details"
									/>

									<CheckoutDivider spacing="loose" />

									{productDescription.deliverableTo && (
										<>
											<fieldset>
												<h2 css={legend}>Where should we deliver to?</h2>
												<AddressFields
													scope={'delivery'}
													lineOne={deliveryLineOne}
													lineTwo={deliveryLineTwo}
													city={deliveryCity}
													country={deliveryCountry}
													state={deliveryState}
													postCode={deliveryPostcode}
													countries={productDescription.deliverableTo}
													errors={[]}
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
													onFindAddress={(postcode) => {
														setDeliveryPostcodeStateLoading(true);
														void findAddressesForPostcode(postcode).then(
															(results) => {
																setDeliveryPostcodeStateLoading(false);
																setDeliveryPostcodeStateResults(results);
															},
														);
													}}
												/>
											</fieldset>
											<CheckoutDivider spacing="loose" />
											<RadioGroup
												label="Is the billing address the same as the delivery address?"
												hideLabel
												id="billingAddressMatchesDelivery"
												name="billingAddressMatchesDelivery"
												orientation="vertical"
												error={undefined}
											>
												<h2 css={legend}>
													Is the billing address the same as the delivery
													address?
												</h2>

												<Radio
													id="qa-billing-address-same"
													value="yes"
													label="Yes"
													name="billingAddressMatchesDelivery"
													checked={billingAddressMatchesDelivery}
													onChange={() => {
														setBillingAddressMatchesDelivery(true);
													}}
												/>

												<Radio
													id="qa-billing-address-different"
													label="No"
													value="no"
													name="billingAddressMatchesDelivery"
													checked={!billingAddressMatchesDelivery}
													onChange={() => {
														setBillingAddressMatchesDelivery(false);
													}}
												/>
											</RadioGroup>
											<CheckoutDivider spacing="loose" />
											{!billingAddressMatchesDelivery && (
												<fieldset>
													<h2 css={legend}>Your billing address</h2>
													<AddressFields
														scope={'billing'}
														lineOne={billingLineOne}
														lineTwo={billingLineTwo}
														city={billingCity}
														country={billingCountry}
														state={billingState}
														postCode={billingPostcode}
														countries={productDescription.deliverableTo}
														errors={[]}
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
														onFindAddress={(postcode) => {
															setBillingPostcodeStateLoading(true);
															void findAddressesForPostcode(postcode).then(
																(results) => {
																	setBillingPostcodeStateLoading(false);
																	setBillingPostcodeStateResults(results);
																},
															);
														}}
													/>
													<CheckoutDivider spacing="loose" />
												</fieldset>
											)}
										</>
									)}

									{validPaymentMethods.map((paymentMethod) => {
										return (
											<div>
												<Radio
													label={paymentMethod}
													name="paymentMethod"
													value={paymentMethod}
													onChange={() => {
														setPaymentMethod(paymentMethod);
													}}
												/>
											</div>
										);
									})}

									{paymentMethod === 'Stripe' && (
										<>
											<input
												type="hidden"
												name="recaptchaToken"
												value={recaptchaToken}
											/>
											<StripeCardForm
												onCardNumberChange={() => {
													// no-op
												}}
												onExpiryChange={() => {
													// no-op
												}}
												onCvcChange={() => {
													// no-op
												}}
												errors={{}}
												recaptcha={
													<Recaptcha
														// We could change the parents type to Promise and uses await here, but that has
														// a lot of refactoring with not too much gain
														onRecaptchaCompleted={(token) => {
															setRecaptchaToken(token);
															void fetch(
																'/stripe/create-setup-intent/recaptcha',
																{
																	method: 'POST',
																	headers: {
																		'Content-Type': 'application/json',
																	},
																	body: JSON.stringify({
																		isTestUser,
																		stripePublicKey,
																		token,
																	}),
																},
															)
																.then((resp) => resp.json())
																.then((json) =>
																	setStripeClientSecret(
																		(json as Record<string, string>)
																			.client_secret,
																	),
																);
														}}
														onRecaptchaExpired={() => {
															// no-op
														}}
													/>
												}
											/>
										</>
									)}

									{paymentMethod === 'DirectDebit' && (
										<DirectDebitForm
											countryGroupId={countryGroupId}
											accountHolderName={accountHolderName}
											accountNumber={accountNumber}
											accountHolderConfirmation={accountHolderConfirmation}
											sortCode={sortCode}
											recaptchaCompleted={false}
											updateAccountHolderName={(name: string) => {
												setAccountHolderName(name);
											}}
											updateAccountNumber={(number: string) => {
												setAccountNumber(number);
											}}
											updateSortCode={(sortCode: string) => {
												setSortCode(sortCode);
											}}
											updateAccountHolderConfirmation={(
												confirmation: boolean,
											) => {
												setAccountHolderConfirmation(confirmation);
											}}
											recaptcha={
												<Recaptcha
													// We could change the parents type to Promise and uses await here, but that has
													// a lot of refactoring with not too much gain
													onRecaptchaCompleted={(token) => {
														setRecaptchaToken(token);
													}}
													onRecaptchaExpired={() => {
														// no-op
													}}
												/>
											}
											formError={''}
											errors={{}}
										/>
									)}
								</BoxContents>
							</Box>

							<DefaultPaymentButton
								buttonText="Pay now"
								onClick={() => {
									// no-op
									// This isn't needed because we are now using the form onSubmit handler
								}}
								type="submit"
							/>
						</form>
						<GuardianTsAndCs
							mobileTheme={'light'}
							displayPatronsCheckout={false}
						/>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}

export default renderPage(
	<StripeElements key={stripePublicKey} stripeKey={stripePublicKey}>
		<Checkout />
	</StripeElements>,
);
