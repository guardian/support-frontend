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
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	CardNumberElement,
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import type {
	ExpressPaymentType,
	PaymentMethodResult,
	StripeError,
} from '@stripe/stripe-js';
import type {
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
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
import type { Participations } from 'helpers/abTests/models';
import { config } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import type {
	CreateStripePaymentIntentRequest,
	PaymentResult,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import {
	postOneOffPayPalCreatePaymentRequest,
	processStripePaymentIntentRequest,
	processStripePaymentIntentRequestForPaypal,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod as LegacyPaymentMethod } from 'helpers/forms/paymentMethods';
import {
	isPaymentMethod,
	PayPal,
	Stripe,
	toPaymentMethodSwitchNaming,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
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
import {
	payPalCancelUrl,
	payPalReturnUrl,
	stripePayPalReturnUrl,
} from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import {
	getSanitisedHtml,
	parseCustomAmounts,
	roundToDecimalPlaces,
} from 'helpers/utilities/utilities';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { ContributionCheckoutFinePrint } from 'pages/supporter-plus-landing/components/contributionCheckoutFinePrint';
import { CoverTransactionCost } from 'pages/supporter-plus-landing/components/coverTransactionCost';
import { FinePrint } from 'pages/supporter-plus-landing/components/finePrint';
import { FooterTsAndCs } from 'pages/supporter-plus-landing/components/footerTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { CheckoutNudgeSelector } from '../../../components/checkoutNudge/checkoutNudge';
import type { CheckoutNudgeSettings } from '../../../helpers/abTests/checkoutNudgeAbTests';
import useEmailMarketingUtmSession from '../../../helpers/customHooks/useEmailMarketingUtmSession';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import type { OneTimeCheckoutVariant } from '../../../helpers/globalsAndSwitches/oneTimeCheckoutSettings';
import {
	updateAbandonedBasketCookie,
	useAbandonedBasketCookie,
} from '../../../helpers/storage/abandonedBasketCookies';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import { PersonalEmailFields } from '../checkout/components/PersonalEmailFields';
import { setThankYouOrder } from '../checkout/helpers/sessionStorage';
import getConsentValue from '../helpers/getConsentValue';
import { maybeArrayWrap } from '../helpers/maybeArrayWrap';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from '../validation';
import { BackButton } from './backButton';
import { FormSection, Legend, shorterBoxMargin } from './form';
import GuardianPageLayout from './GuardianPageLayout';
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
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	stripePublicKey: string;
	countryId: IsoCountry;
	abParticipations: Participations;
	useStripeExpressCheckout: boolean;
	nudgeSettings?: CheckoutNudgeSettings;
	landingPageSettings: LandingPageVariant;
	oneTimeCheckoutSettings: OneTimeCheckoutVariant;
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
	countryId: IsoCountry,
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
		countryId,
	);
}

export function OneTimeCheckoutComponent({
	supportRegionId,
	appConfig,
	stripePublicKey,
	countryId,
	abParticipations,
	useStripeExpressCheckout,
	nudgeSettings,
	landingPageSettings,
	oneTimeCheckoutSettings,
}: OneTimeCheckoutComponentProps) {
	const { currency, currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const urlSearchParams = new URLSearchParams(window.location.search);

	const preSelectedAmountParam = urlSearchParams.get('contribution');
	const { isMarketingEmailSession } = useEmailMarketingUtmSession();

	const user = appConfig.user;
	const isSignedIn = !!user?.email;
	const inStripePaymentElementVariant =
		abParticipations.stripePaymentElementTest === 'variant';

	let customAmountsData;
	const customAmountsParam = urlSearchParams.get('amounts');
	if (customAmountsParam) {
		const amounts = parseCustomAmounts(customAmountsParam);
		customAmountsData = {
			amounts,
			defaultAmount: amounts[1] ?? 0,
			hideChooseYourAmount: false,
		};
	}

	const amountsDataFromOneTimeCheckoutSettings =
		oneTimeCheckoutSettings.amounts;
	const { amounts, defaultAmount, hideChooseYourAmount } =
		customAmountsData ?? amountsDataFromOneTimeCheckoutSettings;

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
		const initialiseStripeExpress = async () => {
			if (useStripeExpressCheckout && finalAmount && elements) {
				// valid elements and final amount, set amount, enable Express checkout
				await elements.update({ amount: finalAmount * 100 });
				setStripeExpressCheckoutEnable(true);
			} else {
				// invalid elements and final amount, disable Express checkout
				setStripeExpressCheckoutEnable(false);
			}
		};
		void initialiseStripeExpress();
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
	const paymentElement = elements?.getElement(PaymentElement);
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
	type StripeOnlyField = 'cardNumber' | 'expiry' | 'cvc';
	useEffect(() => {
		if (paymentMethodError) {
			paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [paymentMethodError]);

	const formRef = useRef<HTMLFormElement>(null);
	const paymentMethodRef = useRef<HTMLFieldSetElement>(null);

	const [stripeFieldsAreEmpty, setStripeFieldsAreEmpty] = useState<
		Record<StripeOnlyField, boolean>
	>({ cardNumber: true, expiry: true, cvc: true });
	type StripeField = StripeOnlyField | 'recaptcha';
	const [stripeFieldError, setStripeFieldError] = useState<
		Partial<Record<StripeField, string>>
	>({});

	const [isPaymentElementComplete, setIsPaymentElementComplete] =
		useState(false);
	const [recaptchaError, setRecaptchaError] = useState<string>();

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

	useEffect(() => {
		// Return to the default state when payment method changes
		setStripeFieldsAreEmpty({
			cardNumber: true,
			expiry: true,
			cvc: true,
		});
		setStripeFieldError({});
	}, [paymentMethod]);

	// Reset recaptcha error when recaptcha token changes
	useEffect(() => {
		setStripeFieldError((previousState) => ({
			...previousState,
			recaptcha: undefined,
		}));
	}, [recaptchaToken]);

	const formOnSubmit = async (formData: FormData) => {
		const similarProductsConsent = getConsentValue(formData, CONSENT_ID);

		if (finalAmount) {
			if (paymentMethod === 'None') {
				setPaymentMethodError('Please select a payment method');
				return;
			}

			if (!inStripePaymentElementVariant && paymentMethod === 'Stripe') {
				const newStripeFieldError = {
					...(stripeFieldsAreEmpty.cardNumber && {
						cardNumber: 'Please enter card number',
					}),
					...(stripeFieldsAreEmpty.expiry && {
						expiry: 'Please enter expiry',
					}),
					...(stripeFieldsAreEmpty.cvc && {
						cvc: 'Please enter CVC',
					}),
					// Recaptcha works slightly differently because we own the state
					...(!recaptchaToken && {
						recaptcha: 'Please complete security check',
					}),
				};
				// Don't go any further if there are errors for any Stripe fields
				if (Object.values(newStripeFieldError).some((value) => value)) {
					setStripeFieldError(newStripeFieldError);
					paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
					return;
				}
			}
			if (inStripePaymentElementVariant && paymentMethod === 'Stripe') {
				if (!isPaymentElementComplete || !recaptchaToken) {
					if (!isPaymentElementComplete) {
						setPaymentMethodError('Please complete missing payment details');
					}
					if (!recaptchaToken) {
						setRecaptchaError('Please complete security check');
					}
					paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
					return;
				}
			}
			setIsProcessingPayment(true);

			let paymentResult: PaymentResult | undefined;
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
					countryId,
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

			let paymentMethodResult: PaymentMethodResult | undefined;
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

			if (
				paymentMethod === 'Stripe' &&
				stripe &&
				paymentElement &&
				recaptchaToken &&
				elements
			) {
				await elements.submit();
				paymentMethodResult = await stripe.createPaymentMethod({
					elements,
					params: {
						billing_details: {
							address: {
								postal_code: billingPostcode,
							},
						},
					},
				});
			}
			if (paymentMethodResult && stripe && elements) {
				// Based on file://./../../components/stripeCardForm/stripePaymentButton.tsx#oneOffPayment
				const handle3DS = (clientSecret: string) => {
					trackComponentLoad('stripe-3ds');
					return stripe.handleCardAction(clientSecret);
				};

				const handlePaypal = (
					clientSecret: string,
				): Promise<{ error: StripeError }> => {
					trackComponentLoad('stripe-Paypal');
					return stripe.confirmPayment({
						elements,
						clientSecret,
						confirmParams: {
							return_url: stripePayPalReturnUrl(
								countryGroupId,
								email,
								stripePublicKey,
								currencyKey,
								finalAmount,
							),
						},
					});
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
					const getStripePaymentMethod = (): StripePaymentMethod => {
						if (paymentMethod === 'StripeExpressCheckoutElement') {
							if (stripeExpressCheckoutPaymentType === 'apple_pay') {
								return 'StripeApplePay';
							} else {
								return 'StripePaymentRequestButton';
							}
						}
						if (paymentMethodResult.paymentMethod.paypal) {
							return 'StripePaypal';
						}
						return 'StripeCheckout';
					};

					const stripePaymentMethod: StripePaymentMethod =
						getStripePaymentMethod();

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
							countryId,
						),

						publicKey: stripePublicKey,
						recaptchaToken: recaptchaToken ?? '',
						paymentMethodId: paymentMethodResult.paymentMethod.id,
						similarProductsConsent,
					};
					if (stripePaymentMethod === 'StripePaypal') {
						cookie.set(
							'acquisition_data',
							encodeURIComponent(JSON.stringify(stripeData.acquisitionData)),
						);
						setThankYouOrder({
							firstName: '',
							email: email,
							paymentMethod: paymentMethod,
							status: 'success', // retry pending mechanism not applied to one-time payments
						});

						// If we successfully create a Payment Intent then this call will redirect to the paypal confirmation page.
						// In this case paymentResult will not be set and it will not continue past this point.
						paymentResult = await processStripePaymentIntentRequestForPaypal(
							stripeData,
							handlePaypal,
						);
					} else {
						paymentResult = await processStripePaymentIntentRequest(
							stripeData,
							handle3DS,
						);
					}
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
				paymentResult.type === 'stripe' &&
					paymentResult.result.userType &&
					thankYouUrlSearchParams.set(
						'userType',
						paymentResult.result.userType,
					);
				const nextStepRoute = paymentResultThankyouRoute(
					paymentResult,
					supportRegionId,
					thankYouUrlSearchParams,
				);
				if (nextStepRoute) {
					window.location.href = nextStepRoute;
				} else {
					setErrorMessage('Sorry, something went wrong.');
					if (
						paymentResult.type === 'stripe' &&
						paymentResult.result.paymentStatus === 'failure'
					) {
						setErrorContext(
							appropriateErrorMessage(paymentResult.result.error ?? ''),
						);
					}
					setIsProcessingPayment(false);
				}
			} else {
				setIsProcessingPayment(false);
			}
		}
	};

	function paymentResultThankyouRoute(
		paymentResult: PaymentResult,
		supportRegionId: SupportRegionId,
		thankYouUrlSearchParams: URLSearchParams,
	): string | undefined {
		if (
			paymentResult.type === 'paypal' &&
			paymentResult.result.type === 'success'
		) {
			// redirect to paypal approval url
			return paymentResult.result.data.approvalUrl;
		} else if (
			paymentResult.type === 'stripe' &&
			paymentResult.result.paymentStatus === 'success'
		) {
			return `/${supportRegionId}/thank-you?${thankYouUrlSearchParams.toString()}`;
		}
		return undefined;
	}

	useAbandonedBasketCookie(
		'OneTimeContribution',
		finalAmount ?? 0,
		'ONE_OFF',
		supportRegionId,
		abParticipations.abandonedBasket === 'variant',
	);

	const paymentButtonText = finalAmount
		? paymentMethod === 'PayPal'
			? `Pay ${simpleFormatAmount(currency, finalAmount)} with PayPal`
			: `Support us with ${simpleFormatAmount(currency, finalAmount)}`
		: 'Pay now';

	return (
		<GuardianPageLayout borderBox>
			<Box>
				<BoxContents>
					<div
						css={css`
							${textSans17}
						`}
					>
						<div css={titleAndButtonContainer}>
							<h2 css={title}>
								<span
									dangerouslySetInnerHTML={{
										__html: getSanitisedHtml(oneTimeCheckoutSettings.heading),
									}}
								/>
							</h2>
							<BackButton
								path={`/${supportRegionId}/contribute`}
								buttonText="back"
							/>
						</div>
						<p css={standFirst}>
							<span
								dangerouslySetInnerHTML={{
									__html: getSanitisedHtml(oneTimeCheckoutSettings.subheading),
								}}
							/>
						</p>
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
									onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
										event.target.checkValidity(); // loose focus, onInvalid check fired
									}}
									onOtherAmountChange={
										setOtherAmount as (value: string) => void
									}
									errors={[otherAmountError ?? '']}
									onInvalid={(event: React.FormEvent<HTMLInputElement>) => {
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
					{nudgeSettings && (
						<CheckoutNudgeSelector
							nudgeSettings={nudgeSettings}
							currentProduct={'OneTimeContribution'}
							currentRatePlan={'OneTime'}
							supportRegionId={supportRegionId}
							landingPageSettings={landingPageSettings}
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
							{inStripePaymentElementVariant && (
								<>
									{paymentMethodError && (
										<div role="alert" data-qm-error>
											<ErrorSummary
												cssOverrides={css`
													margin-bottom: ${space[6]}px;
												`}
												message={paymentMethodError}
												context={errorContext}
											/>
										</div>
									)}
									<PaymentElement
										options={{
											fields: { billingDetails: { address: 'if_required' } },
											layout: {
												type: 'accordion',
												radios: 'always',
												spacedAccordionItems: true,
											},
											wallets: {
												link: 'never',
											}
										}}
										onFocus={() => {
											setPaymentMethod(Stripe);
										}}
										onChange={(event) => {
											setIsPaymentElementComplete(event.complete);
											setPaymentMethodError(undefined);
										}}
									/>
									{recaptchaError && (
										<div role="alert" data-qm-error>
											<ErrorSummary
												cssOverrides={css`
													margin-bottom: ${space[6]}px;
												`}
												message={recaptchaError}
												context={errorContext}
											/>
										</div>
									)}
									<Recaptcha
										onRecaptchaCompleted={(token) => {
											setRecaptchaToken(token);
											setRecaptchaError(undefined);
										}}
										onRecaptchaExpired={() => {
											setRecaptchaToken(undefined);
											setRecaptchaError(undefined);
										}}
									/>
								</>
							)}
							{!inStripePaymentElementVariant && (
								<RadioGroup
									role="radiogroup"
									label="Select payment method"
									hideLabel
									error={paymentMethodError}
								>
									{validPaymentMethods.map((validPaymentMethod) => {
										const selected = paymentMethod === validPaymentMethod;
										const { label, icon } =
											paymentMethodData[validPaymentMethod];

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
															sendEventPaymentMethodSelected(
																validPaymentMethod,
															);
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
															onCardNumberChange={(
																event: StripeCardNumberElementChangeEvent,
															) => {
																setStripeFieldsAreEmpty((prevState) => ({
																	...prevState,
																	cardNumber: event.empty,
																}));

																// Clear errors when the field changes, we'll (re) show errors, if any, on submit
																setStripeFieldError((prevState) => ({
																	...prevState,
																	cardNumber: undefined,
																}));
															}}
															onExpiryChange={(
																event: StripeCardExpiryElementChangeEvent,
															) => {
																setStripeFieldsAreEmpty((prevState) => ({
																	...prevState,
																	expiry: event.empty,
																}));

																// Clear errors when the field changes, we'll (re) show errors, if any, on submit
																setStripeFieldError((prevState) => ({
																	...prevState,
																	expiry: undefined,
																}));
															}}
															onCvcChange={(
																event: StripeCardCvcElementChangeEvent,
															) => {
																setStripeFieldsAreEmpty((prevState) => ({
																	...prevState,
																	cvc: event.empty,
																}));

																// Clear errors when the field changes, we'll (re) show errors, if any, on submit
																setStripeFieldError((prevState) => ({
																	...prevState,
																	cvc: undefined,
																}));
															}}
															errors={{
																cardNumber: maybeArrayWrap(
																	stripeFieldError.cardNumber,
																),
																expiry: maybeArrayWrap(stripeFieldError.expiry),
																cvc: maybeArrayWrap(stripeFieldError.cvc),
																recaptcha: maybeArrayWrap(
																	stripeFieldError.recaptcha,
																),
															}}
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
							)}
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
								finalAmount ?? 0,
							)}
						/>

						{!isMarketingEmailSession && (
							<div css={similarProductsConsentCheckboxContainer}>
								<SimilarProductsConsent />
							</div>
						)}

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
		</GuardianPageLayout>
	);
}
