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
import { renderPage } from 'helpers/rendering/render';
import { get } from 'helpers/storage/cookie';
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

	const productDescription = productCatalogDescription[query.product];
	const ratePlanDescription = productDescription.ratePlans[query.ratePlan];
	let paymentFrequency;
	if (ratePlanDescription.billingPeriod === 'Annual') {
		paymentFrequency = 'year';
	} else if (ratePlanDescription.billingPeriod === 'Month') {
		paymentFrequency = 'month';
	} else {
		paymentFrequency = 'quarter';
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
		const data = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
			product: formData.get('product') as string,
			ratePlan: formData.get('ratePlan') as string,
			currency: formData.get('currency') as string,
			recaptchaToken: formData.get('recaptchaToken') as string,
		};

		const deliveryAddress = productDescription.deliverableTo
			? {
					lineOne: formData.get('delivery-lineOne') as string,
					lineTwo: formData.get('delivery-lineTwo') as string,
					city: formData.get('delivery-city') as string,
					state: formData.get('delivery-state') as string,
					postcode: formData.get('delivery-postcode') as string,
			  }
			: {};

		const billingAddressMatchesDelivery =
			formData.get('billingAddressMatchesDelivery') === 'yes';

		const billingAddress =
			productDescription.deliverableTo && !billingAddressMatchesDelivery
				? {
						lineOne: formData.get('billing-lineOne') as string,
						lineTwo: formData.get('billing-lineTwo') as string,
						city: formData.get('billing-city') as string,
						state: formData.get('billing-state') as string,
						postcode: formData.get('billing-postcode') as string,
				  }
				: deliveryAddress;

		if (
			paymentMethod === 'Stripe' &&
			stripe &&
			cardElement &&
			stripeClientSecret
		) {
			const stripeIntentResult = await stripe.confirmCardSetup(
				stripeClientSecret,
				{
					payment_method: {
						card: cardElement,
					},
				},
			);

			if (stripeIntentResult.error) {
				console.error(stripeIntentResult.error);
			} else if (stripeIntentResult.setupIntent.payment_method) {
				const paymentFields = {
					recaptchaToken: recaptchaToken,
					stripePaymentType: 'StripeCheckout',
					paymentMethod: stripeIntentResult.setupIntent
						.payment_method as string,
				};

				// This data is what will be posted to /create
				console.info('Posting data', {
					...data,
					paymentFields,
					deliveryAddress,
					billingAddress,
				});
			}
		}

		if (paymentMethod === 'DirectDebit') {
			const paymentFields = {
				accountHolderName: formData.get('accountHolderName') as string,
				accountNumber: formData.get('accountNumber') as string,
				sortCode: formData.get('sortCode') as string,
				recaptchaToken,
			};

			// This data is what will be posted to /create
			console.info('Posting data', {
				...data,
				paymentFields,
				deliveryAddress,
				billingAddress,
			});
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
								/** we defer this to an external function as a lot of the payment methods use async */
								void formOnSubmit(formData);

								return false;
							}}
						>
							<input type="hidden" name="product" value={query.product} />
							<input type="hidden" name="ratePlan" value={query.ratePlan} />
							<input type="hidden" name="currency" value={currentCurrencyKey} />

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
													country={countryId}
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
													setCountry={() => {
														// no-op
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
														country={countryId}
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
														setCountry={() => {
															// no-op
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
