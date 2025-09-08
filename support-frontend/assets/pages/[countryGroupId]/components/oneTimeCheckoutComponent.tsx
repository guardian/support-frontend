import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	space,
	textSans17,
} from '@guardian/source/foundations';
import {
	Radio,
	RadioGroup,
	TextInput,
} from '@guardian/source/react-components';
import {
	Divider,
	ErrorSummary,
} from '@guardian/source-development-kitchen/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	CardNumberElement,
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { paymentMethodData } from 'components/paymentMethodSelector/paymentMethodData';
import { PriceCards } from 'components/priceCards/priceCards';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { config } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import {
	postOneOffPayPalCreatePaymentRequest,
	processStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
	CreatePayPalPaymentResponse,
	CreateStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
	PaymentResult,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod as LegacyPaymentMethod } from 'helpers/forms/paymentMethods';
import {
	isPaymentMethod,
	PayPal,
	Stripe,
	toPaymentMethodSwitchNaming,
} from 'helpers/forms/paymentMethods';
import { getSettings, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { productCatalog } from 'helpers/productCatalog';
import * as cookie from 'helpers/storage/cookie';
import type { PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';
import {
	derivePaymentApiAcquisitionData,
	getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import {
	sendEventOneTimeCheckoutValue,
	sendEventPaymentMethodSelected,
} from 'helpers/tracking/quantumMetric';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { roundToDecimalPlaces } from 'helpers/utilities/utilities';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { ContributionCheckoutFinePrint } from 'pages/supporter-plus-landing/components/contributionCheckoutFinePrint';
import { CoverTransactionCost } from 'pages/supporter-plus-landing/components/coverTransactionCost';
import { FinePrint } from 'pages/supporter-plus-landing/components/finePrint';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { FooterTsAndCs } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import { CheckoutNudge } from '../../../components/checkoutNudge/checkoutNudge';
import {
	updateAbandonedBasketCookie,
	useAbandonedBasketCookie,
} from '../../../helpers/storage/abandonedBasketCookies';
import { PersonalEmailFields } from '../checkout/components/PersonalEmailFields';
import { setThankYouOrder } from '../checkout/helpers/sessionStorage';
import getConsentValue from '../helpers/getConsentValue';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from '../validation';
import { BackButton } from './backButton';
import { CheckoutLayout } from './checkoutLayout';
import { FormSection, Legend, shorterBoxMargin } from './form';
import {
	checkedRadioLabelColour,
	defaultRadioLabelColour,
	paymentMethodBody,
	PaymentMethodRadio,
	PaymentMethodSelector,
} from './paymentMethod';
import SimilarProductsConsent, { CONSENT_ID } from './SimilarProductsConsent';

/**
 * We have not added StripeExpressCheckoutElement to the old PaymentMethod
 * as it is heavily coupled through the code base and would require adding
 * a lot of extra unused code to those coupled areas.
 */
type PaymentMethod = LegacyPaymentMethod | 'StripeExpressCheckoutElement';
const titleAndButtonContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 6px 0 ${space[3]}px;
	${from.desktop} {
		margin-bottom: 0;
	}
`;

const title = css`
	${headlineBold24};
	${from.tablet} {
		font-size: 28px;
	}
`;

const standFirst = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

const tcContainer = css`
	color: ${neutral[20]};
	& a {
		color: ${neutral[20]};
	}
`;

const similarProductsConsentCheckboxContainer = css`
	padding: 6px ${space[4]}px;
	background-color: ${neutral[97]};
	border-radius: 12px;
	margin: ${space[4]}px 0px ${space[2]}px;
	${from.tablet} {
		margin-top: ${space[5]}px 0px 0px;
	}
	> div > input {
		background-color: ${neutral[100]};
	}
`;

type OneTimeCheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	stripePublicKey: string;
	countryId: IsoCountry;
	abParticipations: Participations;
	useStripeExpressCheckout: boolean;
};

function paymentMethodIsActive(paymentMethod: PaymentMethod) {
	return isSwitchOn(
		`oneOffPaymentMethods.${toPaymentMethodSwitchNaming(
			paymentMethod as LegacyPaymentMethod,
		)}`,
	);
}

function getPreSelectedAmount(
	preSelectedAmountParam: string | null,
	amountChoices: number[],
): {
	preSelectedOtherAmount?: string;
	preSelectedPriceCard?: number | 'other';
} {
	const preSelectedAmount = preSelectedAmountParam
		? parseInt(preSelectedAmountParam, 10)
		: undefined;

	if (preSelectedAmount === undefined) {
		return {
			preSelectedOtherAmount: undefined,
			preSelectedPriceCard: undefined,
		};
	}

	const preSelectedPriceCard = amountChoices.includes(preSelectedAmount)
		? preSelectedAmount
		: 'other';

	return {
		preSelectedOtherAmount: preSelectedAmount.toString(),
		preSelectedPriceCard,
	};
}

function getFinalAmount(
	selectedPriceCard: number | 'other',
	otherAmount: string,
	minAmount: number,
	maxAmount: number,
	coverTransactionCostSelected: boolean,
): number | undefined {
	const transactionMultiplier: number = coverTransactionCostSelected ? 1.04 : 1;
	if (selectedPriceCard === 'other') {
		const parsedAmount = parseFloat(otherAmount);
		return Number.isNaN(parsedAmount) ||
			parsedAmount < minAmount ||
			parsedAmount > maxAmount
			? undefined
			: roundToDecimalPlaces(parsedAmount * transactionMultiplier);
	}
	return roundToDecimalPlaces(selectedPriceCard * transactionMultiplier);
}

function getAcquisitionData(
	abParticipations: Participations,
	billingPostcode: string,
	coverTransactionCost: boolean,
): PaymentAPIAcquisitionData {
	const referrerAcquisitionData = getReferrerAcquisitionData();
	return derivePaymentApiAcquisitionData(
		{
			...referrerAcquisitionData,
			labels: [
				...(referrerAcquisitionData.labels ?? []),
				'one-time-checkout',
				...(coverTransactionCost ? ['transaction-fee-covered'] : []),
			],
		},
		abParticipations,
		billingPostcode,
	);
}

export function OneTimeCheckoutComponent({
	geoId,
	appConfig,
	stripePublicKey,
	countryId,
	abParticipations,
	useStripeExpressCheckout,
}: OneTimeCheckoutComponentProps) {
	const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const urlSearchParams = new URLSearchParams(window.location.search);

	const preSelectedAmountParam = urlSearchParams.get('contribution');

	const user = appConfig.user;
	const isSignedIn = !!user?.email;

	const settings = getSettings();
	const { selectedAmountsVariant } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		settings,
	);

	const { amountsCardData } = selectedAmountsVariant;
	const { amounts, defaultAmount, hideChooseYourAmount } =
		amountsCardData['ONE_OFF'];

	const { preSelectedPriceCard, preSelectedOtherAmount } = getPreSelectedAmount(
		preSelectedAmountParam,
		amounts,
	);

	const minAmount = config[countryGroupId]['ONE_OFF'].min;
	const maxAmount = config[countryGroupId]['ONE_OFF'].max;

	const [selectedPriceCard, setSelectedPriceCard] = useState<number | 'other'>(
		preSelectedPriceCard ?? defaultAmount,
	);

	const [otherAmount, setOtherAmount] = useState<string>(
		preSelectedOtherAmount ?? '',
	);

	const [otherAmountError, setOtherAmountError] = useState<string>();
	const [coverTransactionCost, setCoverTransactionCost] =
		useState<boolean>(false);

	const amountWithoutCoverCost =
		getFinalAmount(
			selectedPriceCard,
			otherAmount,
			minAmount,
			maxAmount,
			false,
		) ?? 0;
	const transactionCoverCost = amountWithoutCoverCost * 0.04;

	const finalAmount = getFinalAmount(
		selectedPriceCard,
		otherAmount,
		minAmount,
		maxAmount,
		coverTransactionCost,
	);

	const elements = useElements();
	useEffect(() => {
		if (useStripeExpressCheckout && finalAmount && elements) {
			// valid elements and final amount, set amount, enable Express checkout
			elements.update({ amount: finalAmount * 100 });
			setStripeExpressCheckoutEnable(true);
		} else {
			// invalid elements and final amount, disable Express checkout
			setStripeExpressCheckoutEnable(false);
		}
	}, [finalAmount, elements, useStripeExpressCheckout]);

	useEffect(() => {
		if (finalAmount) {
			// Track valid final amount selection with QM
			sendEventOneTimeCheckoutValue(finalAmount, currencyKey);
		}
	}, [finalAmount]);

	/** Payment methods: Stripe */
	const stripe = useStripe();
	const cardElement = elements?.getElement(CardNumberElement);
	const [
		stripeExpressCheckoutPaymentType,
		setStripeExpressCheckoutPaymentType,
	] = useState<ExpressPaymentType>();

	const [stripeExpressCheckoutSuccessful, setStripeExpressCheckoutSuccessful] =
		useState(false);
	const [stripeExpressCheckoutReady, setStripeExpressCheckoutReady] =
		useState(false);
	const [stripeExpressCheckoutEnable, setStripeExpressCheckoutEnable] =
		useState(false);
	useEffect(() => {
		if (stripeExpressCheckoutSuccessful) {
			formRef.current?.requestSubmit();
		}
	}, [stripeExpressCheckoutSuccessful]);

	/** Recaptcha */
	const [recaptchaToken, setRecaptchaToken] = useState<string>();

	/** Personal details **/
	const [email, setEmail] = useState(user?.email ?? '');
	const [billingPostcode, setBillingPostcode] = useState('');
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();

	/** General error that can occur via fetch validations */
	const [errorMessage, setErrorMessage] = useState<string>();
	const [errorContext, setErrorContext] = useState<string>();

	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const validPaymentMethods = [Stripe, PayPal]
		.filter(isPaymentMethod)
		.filter(paymentMethodIsActive);

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('None');
	const [paymentMethodError, setPaymentMethodError] = useState<string>();
	useEffect(() => {
		if (paymentMethodError) {
			paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [paymentMethodError]);

	const formRef = useRef<HTMLFormElement>(null);
	const paymentMethodRef = useRef<HTMLFieldSetElement>(null);

	const validate = (
		event: React.FormEvent<HTMLInputElement>,
		setAction: React.Dispatch<React.SetStateAction<string | undefined>>,
		missing: string,
		invalid?: string,
	) => {
		preventDefaultValidityMessage(event.currentTarget); // prevent default browser error message
		const validityState = event.currentTarget.validity;
		if (validityState.valid) {
			setAction(undefined); // clear error
		} else {
			if (validityState.valueMissing) {
				setAction(missing); // required
			} else {
				setAction(invalid ?? 'Invalid input'); // pattern mismatch
			}
		}
	};

	const formOnSubmit = async (formData: FormData) => {
		const similarProductsConsent = getConsentValue(formData, CONSENT_ID);

		if (finalAmount) {
			setIsProcessingPayment(true);

			if (paymentMethod === 'None') {
				setPaymentMethodError('Please select a payment method');
			}

			let paymentResult;
			if (paymentMethod === 'PayPal') {
				paymentResult = await postOneOffPayPalCreatePaymentRequest({
					currency: currencyKey,
					amount: finalAmount,
					returnURL: payPalReturnUrl(
						countryGroupId,
						email,
						'/paypal/rest/returnOneTime',
					),
					cancelURL: payPalCancelUrl(countryGroupId),
				});
				const acquisitionData = getAcquisitionData(
					abParticipations,
					billingPostcode,
					coverTransactionCost,
				);
				// We've only created a payment at this point, and the user has to get through
				// the PayPal flow on their site before we can actually try and execute the payment.
				// So we drop a cookie which will be used by the /paypal/rest/return endpoint
				// that the user returns to from PayPal, if payment is successful.
				cookie.set(
					'acquisition_data',
					encodeURIComponent(JSON.stringify(acquisitionData)),
				);
				cookie.set(
					'gu_similar_products_consent',
					JSON.stringify(similarProductsConsent),
					1, // daysToLive
				);
			}

			let paymentMethodResult;
			if (
				paymentMethod === 'StripeExpressCheckoutElement' &&
				stripe &&
				elements
			) {
				paymentMethodResult = await stripe.createPaymentMethod({
					elements,
				});
			}
			if (
				paymentMethod === 'Stripe' &&
				stripe &&
				cardElement &&
				recaptchaToken
			) {
				paymentMethodResult = await stripe.createPaymentMethod({
					type: 'card',
					card: cardElement,
					billing_details: {
						address: {
							postal_code: billingPostcode,
						},
					},
				});
			}
			if (paymentMethodResult && stripe) {
				// Based on file://./../../components/stripeCardForm/stripePaymentButton.tsx#oneOffPayment
				const handle3DS = (clientSecret: string) => {
					trackComponentLoad('stripe-3ds');
					return stripe.handleCardAction(clientSecret);
				};

				if (paymentMethodResult.error) {
					logException(
						`Error creating Payment Method: ${JSON.stringify(
							paymentMethodResult.error,
						)}`,
					);

					if (paymentMethodResult.error.type === 'validation_error') {
						setErrorMessage('There was an issue with your card details.');
						setErrorContext(
							appropriateErrorMessage('payment_details_incorrect'),
						);
					} else {
						setErrorMessage('Sorry, something went wrong.');
						setErrorContext(
							appropriateErrorMessage('payment_provider_unavailable'),
						);
					}
				} else {
					const stripePaymentMethod: StripePaymentMethod =
						paymentMethod === 'StripeExpressCheckoutElement'
							? stripeExpressCheckoutPaymentType === 'apple_pay'
								? 'StripeApplePay'
								: 'StripePaymentRequestButton'
							: 'StripeCheckout';

					const stripeData: CreateStripePaymentIntentRequest = {
						paymentData: {
							currency: currencyKey,
							amount: finalAmount,
							email,
							stripePaymentMethod: stripePaymentMethod,
						},
						acquisitionData: getAcquisitionData(
							abParticipations,
							billingPostcode,
							coverTransactionCost,
						),
						publicKey: stripePublicKey,
						recaptchaToken: recaptchaToken ?? '',
						paymentMethodId: paymentMethodResult.paymentMethod.id,
						similarProductsConsent,
					};
					paymentResult = await processStripePaymentIntentRequest(
						stripeData,
						handle3DS,
					);
				}
			}

			if (paymentResult) {
				setThankYouOrder({
					firstName: '',
					email: email,
					paymentMethod: paymentMethod,
					status: 'success', // retry pending mechanism not applied to one-time payments
				});
				const thankYouUrlSearchParams = new URLSearchParams();
				thankYouUrlSearchParams.set('contribution', finalAmount.toString());
				'userType' in paymentResult &&
					paymentResult.userType &&
					thankYouUrlSearchParams.set('userType', paymentResult.userType);
				const nextStepRoute = paymentResultThankyouRoute(
					paymentResult,
					geoId,
					thankYouUrlSearchParams,
				);
				if (nextStepRoute) {
					window.location.href = nextStepRoute;
				} else {
					setErrorMessage('Sorry, something went wrong.');
					if (
						'paymentStatus' in paymentResult &&
						paymentResult.paymentStatus === 'failure'
					) {
						setErrorContext(appropriateErrorMessage(paymentResult.error ?? ''));
					}
					setIsProcessingPayment(false);
				}
			} else {
				setIsProcessingPayment(false);
			}
		}
	};

	function paymentResultThankyouRoute(
		paymentResult: PaymentResult | CreatePayPalPaymentResponse | undefined,
		geoId: GeoId,
		thankYouUrlSearchParams: URLSearchParams,
	): string | undefined {
		if (paymentResult) {
			if ('type' in paymentResult && paymentResult.type === 'success') {
				return paymentResult.data.approvalUrl;
			} else if (
				'paymentStatus' in paymentResult &&
				paymentResult.paymentStatus === 'success'
			) {
				return `/${geoId}/thank-you?${thankYouUrlSearchParams.toString()}`;
			}
		}

		return;
	}

	const { supportInternationalisationId } = countryGroups[countryGroupId];

	useAbandonedBasketCookie(
		'OneTimeContribution',
		finalAmount ?? 0,
		'ONE_OFF',
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
	);

	const isAnAbNudgeToLowRegularVariant = ['v1', 'v2'].some(
		(a) => a === abParticipations.abNudgeToLowRegular,
	);
	const nudgeRecurringAmount = productCatalog.Contribution?.ratePlans['Monthly']
		?.pricing[currencyKey] as number;

	const paymentButtonText = finalAmount
		? paymentMethod === 'PayPal'
			? `Pay ${simpleFormatAmount(currency, finalAmount)} with PayPal`
			: `Support us with ${simpleFormatAmount(currency, finalAmount)}`
		: 'Pay now';

	return (
		<CheckoutLayout>
			<Box>
				<BoxContents>
					<div
						css={css`
							${textSans17}
						`}
					>
						<div css={titleAndButtonContainer}>
							<h2 css={title}>Support just once</h2>
							<BackButton path={`/${geoId}/contribute`} buttonText="back" />
						</div>
						<p css={standFirst}>Support us with the amount of your choice.</p>
						<PriceCards
							amounts={amounts}
							selectedAmount={selectedPriceCard}
							currency={currencyKey}
							billingPeriod={BillingPeriod.OneTime}
							onAmountChange={(amount: string) => {
								setSelectedPriceCard(
									amount === 'other' ? amount : Number.parseFloat(amount),
								);
								updateAbandonedBasketCookie(amount);
							}}
							hideChooseYourAmount={hideChooseYourAmount}
							otherAmountField={
								<OtherAmount
									currency={currencyKey}
									minAmount={minAmount}
									maxAmount={maxAmount}
									selectedAmount={selectedPriceCard}
									otherAmount={otherAmount}
									onBlur={(event) => {
										event.target.checkValidity(); // loose focus, onInvalid check fired
									}}
									onOtherAmountChange={setOtherAmount}
									errors={[otherAmountError ?? '']}
									onInvalid={(event) => {
										validate(
											event,
											setOtherAmountError,
											'Please enter an amount.',
											`Please enter an amount between ${minAmount} and ${maxAmount}.`,
										);
									}}
								/>
							}
						/>
					</div>
					{isAnAbNudgeToLowRegularVariant && (
						<CheckoutNudge
							geoId={geoId}
							ratePlanKey="Monthly"
							recurringAmount={nudgeRecurringAmount}
							abTestName="abNudgeToLowRegular"
							abTestVariant={abParticipations.abNudgeToLowRegular}
						/>
					)}
				</BoxContents>
			</Box>
			<form
				ref={formRef}
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
						{useStripeExpressCheckout && (
							<div
								css={css`
									/* Prevent content layout shift */
									min-height: 8px;
								`}
							>
								<ExpressCheckoutElement
									onReady={({ availablePaymentMethods }) => {
										/**
										 * This is use to show UI needed besides this Element
										 * i.e. The "or" divider
										 */
										if (
											!!availablePaymentMethods?.applePay ||
											!!availablePaymentMethods?.googlePay
										) {
											setStripeExpressCheckoutReady(true);
										}
									}}
									onClick={({ resolve }) => {
										/** @see https://docs.stripe.com/elements/express-checkout-element/accept-a-payment?locale=en-GB#handle-click-event */
										if (stripeExpressCheckoutEnable) {
											const options = {
												emailRequired: true,
											};
											// Track payment method selection with QM
											sendEventPaymentMethodSelected(
												'StripeExpressCheckoutElement',
											);

											resolve(options);
										}
									}}
									onConfirm={async (event) => {
										if (!(stripe && elements)) {
											console.error('Stripe not loaded');
											return;
										}

										const { error: submitError } = await elements.submit();

										if (submitError) {
											setErrorMessage(submitError.message);
											return;
										}

										// ->

										setPaymentMethod('StripeExpressCheckoutElement');
										setStripeExpressCheckoutPaymentType(
											event.expressPaymentType,
										);
										event.billingDetails?.email &&
											setEmail(event.billingDetails.email);

										/**
										 * There is a useEffect that listens to this and submits the form
										 * when true
										 */
										setStripeExpressCheckoutSuccessful(true);
									}}
									options={{
										paymentMethods: {
											applePay: 'auto',
											googlePay: 'auto',
											link: 'never',
										},
									}}
								/>

								{stripeExpressCheckoutReady && (
									<Divider
										displayText="or"
										size="full"
										cssOverrides={css`
											::before {
												margin-left: 0;
											}
											::after {
												margin-right: 0;
											}
											margin: 0;
											margin-top: 14px;
											margin-bottom: 14px;
											width: 100%;
											@keyframes fadeIn {
												0% {
													opacity: 0;
												}
												100% {
													opacity: 1;
												}
											}
											animation: fadeIn 1s;
										`}
									/>
								)}
							</div>
						)}

						<FormSection>
							<Legend>1. Your details</Legend>

							<PersonalEmailFields
								email={email}
								setEmail={(email) => setEmail(email)}
								isEmailAddressReadOnly={isSignedIn}
								isSignedIn={isSignedIn}
							/>

							{countryId === 'US' && (
								<div>
									<TextInput
										id="zipCode"
										label="ZIP code"
										name="billing-postcode"
										onChange={(event) => {
											setBillingPostcode(event.target.value);
										}}
										onBlur={(event) => {
											event.target.checkValidity();
										}}
										maxLength={20}
										value={billingPostcode}
										pattern={doesNotContainExtendedEmojiOrLeadingSpace}
										error={billingPostcodeError}
										optional
										onInvalid={(event) => {
											validate(
												event,
												setBillingPostcodeError,
												'Please enter a valid zip code.',
											);
										}}
									/>
								</div>
							)}
						</FormSection>
						<CheckoutDivider spacing="loose" />
						<FormSection ref={paymentMethodRef}>
							<Legend>
								2. Payment method
								<SecureTransactionIndicator hideText={true} />
							</Legend>
							<RadioGroup
								role="radiogroup"
								label="Select payment method"
								hideLabel
								error={paymentMethodError}
							>
								{validPaymentMethods.map((validPaymentMethod) => {
									const selected = paymentMethod === validPaymentMethod;
									const { label, icon } = paymentMethodData[validPaymentMethod];

									return (
										<PaymentMethodSelector selected={selected}>
											<PaymentMethodRadio selected={selected}>
												<Radio
													label={
														<>
															{label} <div>{icon}</div>
														</>
													}
													name="paymentMethod"
													value={validPaymentMethod}
													cssOverrides={
														selected
															? checkedRadioLabelColour
															: defaultRadioLabelColour
													}
													onChange={() => {
														setPaymentMethod(validPaymentMethod);
														setPaymentMethodError(undefined);
														// Track payment method selection with QM
														sendEventPaymentMethodSelected(validPaymentMethod);
													}}
												/>
											</PaymentMethodRadio>
											{validPaymentMethod === 'Stripe' && selected && (
												<div css={paymentMethodBody}>
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
																onRecaptchaCompleted={(token) => {
																	setRecaptchaToken(token);
																}}
																onRecaptchaExpired={() => {
																	setRecaptchaToken(undefined);
																}}
															/>
														}
													/>
												</div>
											)}
										</PaymentMethodSelector>
									);
								})}
							</RadioGroup>
						</FormSection>
						<CoverTransactionCost
							transactionCost={coverTransactionCost}
							transactionCostAmount={simpleFormatAmount(
								currency,
								transactionCoverCost,
							)}
							onChecked={(check) => {
								setCoverTransactionCost(check);
							}}
							transactionCostTotal={simpleFormatAmount(
								currency,
								finalAmount ? finalAmount : 0,
							)}
						/>

						<div css={similarProductsConsentCheckboxContainer}>
							<SimilarProductsConsent />
						</div>

						<div
							css={css`
								margin: ${space[8]}px 0 ${space[6]}px;
							`}
						>
							<DefaultPaymentButton
								buttonText={paymentButtonText}
								onClick={() => {
									// no-op
									// This isn't needed because we are now using the formOnSubmit handler
								}}
								type="submit"
							/>
						</div>
						{errorMessage && (
							<div role="alert" data-qm-error>
								<ErrorSummary
									cssOverrides={css`
										margin-bottom: ${space[6]}px;
									`}
									message={errorMessage}
									context={errorContext}
								/>
							</div>
						)}
						<div css={tcContainer}>
							<FinePrint mobileTheme={'dark'}>
								<FooterTsAndCs
									productKey={'OneTimeContribution'}
									countryGroupId={countryGroupId}
								/>
							</FinePrint>
						</div>
					</BoxContents>
				</Box>
			</form>
			<PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
			<ContributionCheckoutFinePrint mobileTheme={'light'} />
			{isProcessingPayment && (
				<LoadingOverlay>
					<p>Processing transaction</p>
					<p>Please wait</p>
				</LoadingOverlay>
			)}
		</CheckoutLayout>
	);
}
