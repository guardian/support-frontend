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
import { newspaperCountries } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';
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

let currentCurrency: Currency;
let currentCurrencyKey: keyof typeof currencies;
let countryGroupId: CountryGroupId;
switch (geoId) {
	case 'uk':
		currentCurrency = currencies.GBP;
		currentCurrencyKey = 'GBP';
		countryGroupId = 'GBPCountries';
		break;
	case 'us':
		currentCurrency = currencies.USD;
		currentCurrencyKey = 'USD';
		countryGroupId = 'UnitedStates';
		break;
	case 'au':
		currentCurrency = currencies.AUD;
		currentCurrencyKey = 'AUD';
		countryGroupId = 'AUDCountries';
		break;
	case 'eu':
		currentCurrency = currencies.EUR;
		currentCurrencyKey = 'EUR';
		countryGroupId = 'EURCountries';
		break;
	case 'nz':
		currentCurrency = currencies.NZD;
		currentCurrencyKey = 'NZD';
		countryGroupId = 'NZDCountries';
		break;
	case 'ca':
		currentCurrency = currencies.CAD;
		currentCurrencyKey = 'CAD';
		countryGroupId = 'Canada';
		break;
	case 'int':
		currentCurrency = currencies.USD;
		currentCurrencyKey = 'USD';
		countryGroupId = 'International';
		break;
}

const isSignedIn = !!get('GU_U');
const countryId: IsoCountry =
	CountryHelper.fromString(get('GU_country') ?? 'GB') ?? 'GB';

const productCatalog = window.guardian.productCatalog;

/** Page config - this is setup specifically for the checkout page */
const searchParams = new URLSearchParams(window.location.search);
const query = {
	product: searchParams.get('product'),
	ratePlan: searchParams.get('ratePlan'),
};

function describeProduct(product: string, ratePlan: string) {
	let description = `${product} - ${ratePlan}`;
	let frequency = '';
	let showAddressFields = false;
	let addressCountries = {};

	if (product === 'HomeDelivery') {
		frequency = 'month';
		description = `${ratePlan} paper`;

		showAddressFields = true;
		addressCountries = newspaperCountries;

		if (ratePlan === 'Sixday') {
			description = 'Six day paper';
		}
		if (ratePlan === 'Everyday') {
			description = 'Every day paper';
		}
		if (ratePlan === 'Weekend') {
			description = 'Weekend paper';
		}
		if (ratePlan === 'Saturday') {
			description = 'Saturday paper';
		}
		if (ratePlan === 'Sunday') {
			description = 'Sunday paper';
		}
	}

	if (product === 'NationalDelivery') {
		showAddressFields = true;
		addressCountries = newspaperCountries;
	}

	if (
		product === 'GuardianWeeklyDomestic' ||
		product === 'GuardianWeeklyRestOfWorld'
	) {
		showAddressFields = true;
		addressCountries = gwDeliverableCountries;

		if (ratePlan === 'OneYearGift') {
			frequency = 'year';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlan === 'Annual') {
			frequency = 'year';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'Quarterly') {
			frequency = 'quarter';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'Monthly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
		if (ratePlan === 'ThreeMonthGift') {
			frequency = 'quarter';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlan === 'SixWeekly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
	}

	return { description, frequency, showAddressFields, addressCountries };
}

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
	currentCurrencyKey,
	isTestUser,
);

export function Checkout() {
	if (!query.product || !query.ratePlan) {
		return <div>Not enough query parameters</div>;
	}

	/**
	 * We do this check here as we have `noUncheckedIndexedAccess: false` set in our `tsconfig`
	 * which means `productCatalog[query.product]` would never return undefined, but it could.
	 */
	if (!(query.product in productCatalog)) {
		return <div>Product not found</div>;
	}

	const currentProduct = productCatalog[query.product];
	const currentRatePlan = currentProduct.ratePlans[query.ratePlan];
	const currentPrice = currentRatePlan.pricing[currentCurrencyKey];

	const product = describeProduct(query.product, query.ratePlan);
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
	const [billingCountry, setBillingCountry] = useState(countryId);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);

	/**
	 * This is some data normalisation around the productType
	 * that we send to the `/subscribe/create` endpoint.
	 *
	 * This must match the types in `CreateSupportWorkersRequest#product`.
	 *
	 * We might be able to defer this to the backend.
	 */
	let productType:
		| 'Contribution'
		| 'SupporterPlus'
		| 'DigitalPack'
		| 'Paper'
		| 'GuardianWeekly';

	let fulfilmentOptions: 'Domestic' | 'RestofWorld' | undefined;
	if (query.product === 'Contribution') {
		productType = 'Contribution';
	} else if (query.product === 'SupporterPlus') {
		productType = 'SupporterPlus';
	} else if (
		query.product === 'GuardianWeeklyDomestic' ||
		query.product === 'GuardianWeeklyRestOfWorld'
	) {
		productType = 'GuardianWeekly';
		if (query.product === 'GuardianWeeklyDomestic') {
			fulfilmentOptions = 'Domestic';
		} /* if (query.product === 'GuardianWeeklyRestOfWorld') */ else {
			fulfilmentOptions = 'RestofWorld';
		}
	} else if (query.product === 'DigitalSubscription') {
		productType = 'DigitalPack';
	} else if (
		query.product === 'NationalDelivery' ||
		query.product === 'SubscriptionCard' ||
		query.product === 'HomeDelivery'
	) {
		productType = 'Paper';
	}

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
									description={product.description}
									paymentFrequency={product.frequency}
									amount={currentPrice}
									currency={currentCurrency}
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
								/**
								 * The validation for this is currently happening on the client side form validation
								 * So we'll assume strings are not null.
								 * see: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
								 */

								/** Form: Product data */
								const productType = formData.get('productType') as string;
								const currency = formData.get('currency') as string;
								const billingPeriod = formData.get('billingPeriod') as string;
								const fulfilmentOptions = formData.get(
									'fulfilmentOptions',
								) as string;

								const productData = {
									productType,
									currency,
									fulfilmentOptions,
									billingPeriod,
								};

								/** Form: Personal data */
								const personalData = {
									firstName: formData.get('firstName') as string,
									lastName: formData.get('lastName') as string,
									email: formData.get('email') as string,
								};

								/** Form: tracking data  */
								const ophanIds = getOphanIds();
								const referrerAcquisitionData = getReferrerAcquisitionData();
								// TODO - this needs to be populated properly
								const supportAbTests: string[] = [];

								/** Form: data */
								const data = {
									...personalData,
									ophanIds,
									referrerAcquisitionData,
									supportAbTests,
									ratePlan: formData.get('ratePlan') as string,
									currency: formData.get('currency') as string,
									recaptchaToken: formData.get('recaptchaToken') as string,
									product: productData,
								};

								/** Form: Address data */
								const deliveryAddress = product.showAddressFields
									? {
											lineOne: formData.get('delivery-lineOne') as string,
											lineTwo: formData.get('delivery-lineTwo') as string,
											city: formData.get('delivery-city') as string,
											state: formData.get('delivery-state') as string,
											postcode: formData.get('delivery-postcode') as string,
											country: formData.get('delivery-country') as string,
									  }
									: {};

								const billingAddressMatchesDelivery =
									formData.get('billingAddressMatchesDelivery') === 'yes';

								const billingAddress =
									product.showAddressFields && !billingAddressMatchesDelivery
										? {
												lineOne: formData.get('billing-lineOne') as string,
												lineTwo: formData.get('billing-lineTwo') as string,
												city: formData.get('billing-city') as string,
												state: formData.get('billing-state') as string,
												postcode: formData.get('billing-postcode') as string,
												country: formData.get('billing-country') as string,
										  }
										: deliveryAddress;

								if (
									paymentMethod === 'Stripe' &&
									stripe &&
									cardElement &&
									stripeClientSecret
								) {
									void stripe
										.confirmCardSetup(stripeClientSecret, {
											payment_method: {
												card: cardElement,
											},
										})
										.then((result) => {
											if (result.error) {
												console.error(result.error);
											} else if (result.setupIntent.payment_method) {
												const paymentFields = {
													recaptchaToken: recaptchaToken,
													stripePaymentType: 'StripeCheckout',
													paymentMethod: result.setupIntent
														.payment_method as string,
												};

												const createSupportWorkersRequest = {
													...data,
													// TODO - get this from the form
													firstDeliveryDate: '2024-04-26',
													paymentFields,
													deliveryAddress,
													billingAddress,
												};

												// This data is what will be posted to /create
												void fetch('/subscribe/create', {
													method: 'POST',
													body: JSON.stringify(createSupportWorkersRequest),
													headers: {
														'Content-Type': 'application/json',
													},
												})
													.then((response) => {
														console.info(response);
													})
													.catch((error) => {
														console.error(error);
													});
											}
										});
								}

								// The form is sumitted async as a lot of the payment methods require fetch requests
								return false;
							}}
						>
							<input type="hidden" name="product" value={query.product} />
							<input type="hidden" name="ratePlan" value={query.ratePlan} />
							<input type="hidden" name="currency" value={currentCurrencyKey} />
							{/* TODO - this is introduced here https://github.com/guardian/support-frontend/pull/5914 */}
							<input type="hidden" name="billingPeriod" value={'Monthly'} />
							<input
								type="hidden"
								name="fulfilmentOptions"
								value={fulfilmentOptions ?? ''}
							/>
							<input type="hidden" name="productType" value={productType} />

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

									{product.showAddressFields && (
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
													countries={product.addressCountries}
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
														countries={product.addressCountries}
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
