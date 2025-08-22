import { css } from '@emotion/react';
import { size, space } from '@guardian/source/foundations';
import { Radio, RadioGroup } from '@guardian/source/react-components';
import {
	Divider,
	ErrorSummary,
} from '@guardian/source-development-kitchen/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import {
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type {
	ExpressPaymentType,
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { checkAccount } from 'components/directDebit/helpers/ajax';
import { paymentMethodData } from 'components/paymentMethodSelector/paymentMethodData';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import {
	DirectDebit,
	isPaymentMethod,
	type PaymentMethod as LegacyPaymentMethod,
	PayPal,
	Stripe,
	StripeHostedCheckout,
	toPaymentMethodSwitchNaming,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
	productCatalogDescriptionNewBenefits,
	showSimilarProductsConsentForRatePlan,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { useAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { ContributionCheckoutFinePrint } from 'pages/supporter-plus-landing/components/contributionCheckoutFinePrint';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { PaymentTsAndCs } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import { SummaryTsAndCs } from 'pages/supporter-plus-landing/components/summaryTsAndCs';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { postcodeIsWithinDeliveryArea } from '../../../helpers/forms/deliveryCheck';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import { isValidPostcode } from '../../../helpers/forms/formValidation';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { PersonalAddressFields } from '../checkout/components/PersonalAddressFields';
import { PersonalDetailsFields } from '../checkout/components/PersonalDetailsFields';
import { WeeklyDeliveryDates } from '../checkout/components/WeeklyDeliveryDates';
import { WeeklyGiftPersonalFields } from '../checkout/components/WeeklyGiftPersonalFields';
import type { DeliveryAgentsResponse } from '../checkout/helpers/getDeliveryAgents';
import { getDeliveryAgents } from '../checkout/helpers/getDeliveryAgents';
import { getProductFields } from '../checkout/helpers/getProductFields';
import type { CheckoutSession } from '../checkout/helpers/stripeCheckoutSession';
import { useStateWithCheckoutSession } from '../checkout/hooks/useStateWithCheckoutSession';
import { countriesRequiringBillingState } from '../helpers/countriesRequiringBillingState';
import { isSundayOnlyNewspaperSub } from '../helpers/isSundayOnlyNewspaperSub';
import { maybeArrayWrap } from '../helpers/maybeArrayWrap';
import { CheckoutLoadingOverlay } from './checkoutLoadingOverlay';
import {
	FormSection,
	Legend,
	lengthenBoxMargin,
	shorterBoxMargin,
} from './form';
import { submitForm } from './formOnSubmit';
import type { PaymentMethod } from './paymentFields';
import {
	FormSubmissionError,
	getPaymentFieldsForPaymentMethod,
} from './paymentFields';
import {
	checkedRadioLabelColour,
	defaultRadioLabelColour,
	paymentMethodBody,
	PaymentMethodRadio,
	PaymentMethodSelector,
} from './paymentMethod';
import SimilarProductsConsent from './SimilarProductsConsent';
import { SubmitButton } from './submitButton';

function paymentMethodIsActive(paymentMethod: LegacyPaymentMethod) {
	return isSwitchOn(
		`recurringPaymentMethods.${toPaymentMethodSwitchNaming(paymentMethod)}`,
	);
}

type CheckoutFormProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	stripePublicKey: string;
	isTestUser: boolean;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	originalAmount: number;
	discountedAmount?: number;
	contributionAmount?: number;
	finalAmount: number;
	promotion?: Promotion;
	useStripeExpressCheckout: boolean;
	countryId: IsoCountry;
	forcedCountry?: string;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
	checkoutSession?: CheckoutSession;
	clearCheckoutSession: () => void;
	weeklyDeliveryDate: Date;
	setWeeklyDeliveryDate: (value: Date) => void;
	thresholdAmount: number;
};

const getPaymentMethods = (
	countryId: IsoCountry,
	productKey: ProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	const maybeDirectDebit = countryId === 'GB' && DirectDebit;

	if (isSundayOnlyNewspaperSub(productKey, ratePlanKey)) {
		return [maybeDirectDebit, StripeHostedCheckout];
	}

	return [maybeDirectDebit, Stripe, PayPal];
};

const LEGEND_PREFIX_WEEKLY_GIFT = 4;
const LEGEND_PREFIX_DEFAULT = 1;
const getPaymentLegendPrefix = (
	legendPrefix: number,
	isWeeklyGift: boolean,
	hasDeliveryAddress: boolean,
	deliveryPostcodeIsOutsideM25: boolean,
): number => {
	if (isWeeklyGift || !hasDeliveryAddress) {
		return legendPrefix + 1;
	}
	if (!deliveryPostcodeIsOutsideM25) {
		return legendPrefix + 2;
	}
	return legendPrefix + 3;
};

export default function CheckoutForm({
	geoId,
	appConfig,
	stripePublicKey,
	isTestUser,
	productKey,
	ratePlanKey,
	originalAmount,
	contributionAmount,
	finalAmount,
	promotion,
	useStripeExpressCheckout,
	countryId,
	abParticipations,
	checkoutSession,
	clearCheckoutSession,
	weeklyDeliveryDate,
	setWeeklyDeliveryDate,
	thresholdAmount,
}: CheckoutFormProps) {
	const csrf: CsrfState = appConfig.csrf;
	const user = appConfig.user;
	const isSignedIn = !!user?.email;

	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const showNewspaperArchiveBenefit = ['v1', 'v2', 'control'].includes(
		abParticipations.newspaperArchiveBenefit ?? '',
	);

	const productDescription = showNewspaperArchiveBenefit
		? productCatalogDescriptionNewBenefits(countryGroupId)[productKey]
		: productCatalogDescription[productKey];
	const hasDeliveryAddress = !!productDescription.deliverableTo;
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey] ?? {
		billingPeriod: BillingPeriod.Monthly,
	};
	const isSundayOnly = isSundayOnlyNewspaperSub(productKey, ratePlanKey);
	const isRecurringContribution = productKey === 'Contribution';
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);

	const [deliveryAddressErrors, setDeliveryAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);
	const [deliveryPostcode, setDeliveryPostcode] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.deliveryAddress?.postCode,
			'',
		);

	/** Delivery agent for National Delivery product */
	const [deliveryPostcodeIsOutsideM25, setDeliveryPostcodeIsOutsideM25] =
		useState(false);
	const [deliveryAgents, setDeliveryAgents] =
		useState<DeliveryAgentsResponse>();
	const [chosenDeliveryAgent, setChosenDeliveryAgent] = useState<number>();
	const [deliveryAgentError, setDeliveryAgentError] = useState<string>();

	const productFields = getProductFields({
		product: {
			productKey,
			productDescription,
			ratePlanKey,
			deliveryAgent: chosenDeliveryAgent,
		},
		financial: {
			currencyKey,
			finalAmount,
			originalAmount,
			contributionAmount,
		},
	});

	const legendPrefix = isWeeklyGift
		? LEGEND_PREFIX_WEEKLY_GIFT
		: LEGEND_PREFIX_DEFAULT;
	const legendPersonalDetails = `${legendPrefix}. Your details`;
	const legendPayment = `${getPaymentLegendPrefix(
		legendPrefix,
		isWeeklyGift,
		hasDeliveryAddress,
		deliveryPostcodeIsOutsideM25,
	)}. Payment method`;

	/**
	 * Is It a Contribution? URL queryPrice supplied?
	 *    If queryPrice above ratePlanPrice, in a upgrade to S+ country, invalid amount
	 */
	let isInvalidAmount = false;
	if (isRecurringContribution) {
		const supporterPlusRatePlanPrice =
			productCatalog.SupporterPlus?.ratePlans[ratePlanKey]?.pricing[
				currencyKey
			];

		const { selectedAmountsVariant } = getAmountsTestVariant(
			countryId,
			countryGroupId,
			appConfig.settings,
		);
		if (originalAmount < 1) {
			isInvalidAmount = true;
		}
		if (!isContributionsOnlyCountry(selectedAmountsVariant)) {
			if (originalAmount >= (supporterPlusRatePlanPrice ?? 0)) {
				isInvalidAmount = true;
			}
		}
	}

	if (isInvalidAmount) {
		return <div>Invalid Amount {originalAmount}</div>;
	}

	const validPaymentMethods = getPaymentMethods(
		countryId,
		productKey,
		ratePlanKey,
	)
		.filter(isPaymentMethod)
		.filter(paymentMethodIsActive);

	const [paymentMethod, setPaymentMethod] = useStateWithCheckoutSession<
		PaymentMethod | undefined
	>(checkoutSession ? StripeHostedCheckout : undefined, undefined);
	const [paymentMethodError, setPaymentMethodError] = useState<string>();
	type StripeOnlyField = 'cardNumber' | 'expiry' | 'cvc';
	const [stripeFieldsAreEmpty, setStripeFieldsAreEmpty] = useState<{
		[key in StripeOnlyField]: boolean;
	}>({ cardNumber: true, expiry: true, cvc: true });
	type StripeField = StripeOnlyField | 'recaptcha';
	const [stripeFieldError, setStripeFieldError] = useState<{
		[key in StripeField]?: string;
	}>({});
	const [directDebitFieldError, setDirectDebitFieldError] = useState<{
		recaptcha?: string;
	}>({});

	useEffect(() => {
		if (paymentMethodError) {
			paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [paymentMethodError]);

	const isRedirectingToStripeHostedCheckout =
		isSundayOnly &&
		checkoutSession === undefined &&
		paymentMethod === StripeHostedCheckout;

	/** Payment methods: Stripe */
	const stripe = useStripe();
	const elements = useElements();
	const [
		stripeExpressCheckoutPaymentType,
		setStripeExpressCheckoutPaymentType,
	] = useState<ExpressPaymentType>();
	const [stripeExpressCheckoutSuccessful, setStripeExpressCheckoutSuccessful] =
		useState(false);
	const [stripeExpressCheckoutReady, setStripeExpressCheckoutReady] =
		useState(false);
	useEffect(() => {
		if (stripeExpressCheckoutSuccessful) {
			formRef.current?.requestSubmit();
		}
	}, [stripeExpressCheckoutSuccessful]);

	/**
	 * Payment method: PayPal
	 * BAID = Billing Agreement ID
	 */
	const [payPalLoaded, setPayPalLoaded] = useState(false);
	const [payPalBAID, setPayPalBAID] = useState('');
	/**
	 * PayPalBAID forces formOnSubmit
	 */
	useEffect(() => {
		if (payPalBAID !== '') {
			// TODO - this might not meet our browser compatibility requirements (Safari)
			// see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit#browser_compatibility
			formRef.current?.requestSubmit();
		}
	}, [payPalBAID]);
	/**
	 * Checkout session ID forces formOnSubmit
	 * This happens when the user returns from the Stripe hosted checkout with a checkout session ID in the URL
	 */
	useEffect(() => {
		if (checkoutSession?.checkoutSessionId) {
			// TODO - this might not meet our browser compatibility requirements (Safari)
			// see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit#browser_compatibility
			formRef.current?.requestSubmit();
		}
	}, [checkoutSession?.checkoutSessionId]);
	useEffect(() => {
		if (paymentMethod === 'PayPal' && !payPalLoaded) {
			void loadPayPalRecurring().then(() => setPayPalLoaded(true));
		}
	}, [paymentMethod, payPalLoaded]);

	/** Recaptcha */
	const [recaptchaToken, setRecaptchaToken] = useState<string>();

	/** Personal details */
	const [firstName, setFirstName] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.personalData.firstName,
		user?.firstName ?? '',
	);
	const [lastName, setLastName] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.personalData.lastName,
		user?.lastName ?? '',
	);
	const [email, setEmail] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.personalData.email,
		user?.email ?? '',
	);
	const [confirmedEmail, setConfirmedEmail] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.personalData.email,
			'',
		);
	// Session storage unavailable yet, using state
	const [phoneNumber, setPhoneNumber] = useStateWithCheckoutSession<string>(
		undefined,
		'',
	);

	const fetchDeliveryAgentsIfRequired = async (postcode: string) => {
		if (isValidPostcode(postcode)) {
			if (postcodeIsWithinDeliveryArea(postcode)) {
				// The user's postcode is inside the M25
				setDeliveryPostcodeIsOutsideM25(false);
			} else if (
				ratePlanKey === 'Saturday' ||
				ratePlanKey === 'SaturdayPlus' ||
				ratePlanKey === 'Sunday'
			) {
				// The user's postcode is outside the M25 but they have selected a
				// Saturday or Sunday only rate plan which is not supported
				setDeliveryAddressErrors((prevState) => [
					...prevState,
					{
						field: 'postCode',
						message:
							'Saturday or Sunday delivery is available for Greater London only. Go back and select Weekend delivery option or choose a Digital Voucher.',
					},
				]);
			} else {
				// The users postcode is outside the M25 and they have selected a valid rate plan
				setDeliveryPostcodeIsOutsideM25(true);
				const agents = await getDeliveryAgents(postcode);
				if (agents.agents?.length === 1 && agents.agents[0]) {
					setChosenDeliveryAgent(agents.agents[0].agentId);
				}
				setDeliveryAgents(agents);
			}
		} else {
			// The postcode field does not contain a valid postcode, so reset to default state
			setDeliveryPostcodeIsOutsideM25(false);
			setDeliveryAgents(undefined);
			setDeliveryAddressErrors((prevState) =>
				prevState.filter((error) => error.field !== 'postCode'),
			);
		}
	};
	useEffect(() => {
		if (productKey === 'HomeDelivery') {
			void fetchDeliveryAgentsIfRequired(deliveryPostcode);
		}
	}, [deliveryPostcode]);

	useEffect(() => {
		// Return to the default state when payment method changes
		setStripeFieldsAreEmpty({
			cardNumber: true,
			expiry: true,
			cvc: true,
		});
		setStripeFieldError({});
		setDirectDebitFieldError({});
	}, [paymentMethod]);

	// Reset recaptcha error when recaptcha token changes
	useEffect(() => {
		setStripeFieldError((previousState) => ({
			...previousState,
			recaptcha: undefined,
		}));
		setDirectDebitFieldError((previousState) => ({
			...previousState,
			recaptcha: undefined,
		}));
	}, [recaptchaToken]);

	const [billingPostcode, setBillingPostcode] =
		useStateWithCheckoutSession<string>(
			checkoutSession?.formFields.addressFields.billingAddress.postCode,
			'',
		);

	/**
	 * BillingState selector initialised to undefined to hide
	 * billingStateError message. formOnSubmit checks and converts to
	 * empty string to display billingStateError message.
	 */
	const [billingState, setBillingState] = useStateWithCheckoutSession<string>(
		checkoutSession?.formFields.addressFields.billingAddress.state,
		'',
	);

	/** Gift recipient details */
	// Session storage unavailable yet, using state
	const [recipientFirstName, setRecipientFirstName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLastName, setRecipientLastName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientEmail, setRecipientEmail] =
		useStateWithCheckoutSession<string>(undefined, '');

	const formRef = useRef<HTMLFormElement>(null);
	const scrollToViewRef = useRef<HTMLDivElement>(null);
	const paymentMethodRef = useRef<HTMLFieldSetElement>(null);

	useEffect(() => {
		scrollToViewRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [scrollToViewRef.current]);

	/** Direct debit details */
	const [accountHolderName, setAccountHolderName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [sortCode, setSortCode] = useState('');
	const [accountHolderConfirmation, setAccountHolderConfirmation] =
		useState(false);

	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	/** General error that can occur via fetch validations */
	const [errorMessage, setErrorMessage] = useState<string>();
	const [errorContext, setErrorContext] = useState<string>();
	const [postStripeCheckoutErrorMessage, setPostStripeCheckoutErrorMessage] =
		useState<string>();

	// If we get an error, and we've already got a checkout session, clear the checkout session
	// so that the user restarts the checkout process
	useEffect(() => {
		if (errorMessage && checkoutSession) {
			clearCheckoutSession();
			// Clear the standard error message
			setErrorMessage(undefined);
			// Set a specific generic message which will appear at the top of the page
			setPostStripeCheckoutErrorMessage(
				'Please try submitting the form again.',
			);
		}
	}, [errorMessage]);

	const { supportInternationalisationId } = countryGroups[countryGroupId];

	const onFormSubmit = async (formData: FormData) => {
		if (paymentMethod === undefined) {
			setPaymentMethodError('Please select a payment method');
			return;
		}

		if (paymentMethod === 'Stripe') {
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
				...(!recaptchaToken && { recaptcha: 'Please complete security check' }),
			};

			// Don't go any further if there are errors for any Stripe fields
			if (Object.values(newStripeFieldError).some((value) => value)) {
				setStripeFieldError(newStripeFieldError);
				paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
				return;
			}
		}

		if (paymentMethod === 'DirectDebit' && !recaptchaToken) {
			setDirectDebitFieldError({
				recaptcha: 'Please complete security check',
			});
			paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' });
			return;
		}

		const finalProductKey =
			productKey === 'HomeDelivery' && deliveryPostcodeIsOutsideM25
				? 'NationalDelivery'
				: productKey;
		if (finalProductKey == 'NationalDelivery' && !chosenDeliveryAgent) {
			setDeliveryAgentError('Please select a delivery agent');
			return;
		}
		if (paymentMethod === 'DirectDebit') {
			const response = await checkAccount(
				sortCode,
				accountNumber,
				isTestUser,
				csrf,
			);
			if (!response.ok) {
				setErrorMessage('Sorry, we could not process your payment');
				setErrorContext(
					'The transaction was temporarily declined. Please try entering you payment details again. Alternatively try another payment method.',
				);
				return;
			}
		}
		setIsProcessingPayment(true);
		try {
			const paymentFields = await getPaymentFieldsForPaymentMethod(
				paymentMethod,
				stripeExpressCheckoutPaymentType,
				stripe,
				elements,
				isTestUser,
				stripePublicKey,
				recaptchaToken,
				formData,
				checkoutSession?.checkoutSessionId,
			);
			if (paymentFields === undefined) {
				throw new Error('paymentFields is undefined');
			}
			// For StripeHostedCheckout successUrl is a hosted Stripe checkout page
			// for other payment methods it's the thank you page.
			const successUrl = await submitForm({
				geoId,
				productKey: finalProductKey,
				ratePlanKey,
				formData,
				paymentMethod,
				paymentFields,
				productFields,
				hasDeliveryAddress,
				abParticipations,
				promotion,
				contributionAmount,
			});
			window.location.href = successUrl;
		} catch (error) {
			if (error instanceof FormSubmissionError) {
				setErrorMessage(error.message);
				setErrorContext(error.context);
			} else {
				setErrorMessage('Sorry, something went wrong');
				setErrorContext(appropriateErrorMessage('internal_error'));
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error';
				logException(
					`An error occurred in checkoutComponent.tsx while trying to submit the form: ${errorMessage}`,
				);
			}
			// This state update is in the catch block because it has the effect
			// of removing the processing overlay. If it was outside of the
			// try/catch then in the case where the submitForm is successful the
			// overlay would be removed before the redirect has completed
			// resulting in a flash of the checkout with no overlay before the
			// redirect to the thank you page.
			setIsProcessingPayment(false);
		}
	};

	useAbandonedBasketCookie(
		productKey,
		originalAmount,
		ratePlanDescription.billingPeriod,
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
	);

	const billingPeriod = productFields.billingPeriod;
	const billingStatePostcode = {
		billingState: billingState,
		setBillingState: setBillingState,
		billingPostcode: billingPostcode,
		setBillingPostcode: setBillingPostcode,
	};

	return (
		<>
			<form
				ref={formRef}
				onSubmit={(event) => {
					event.preventDefault();
					const form = event.currentTarget;
					const formData = new FormData(form);
					void onFormSubmit(formData);
				}}
			>
				<Box
					cssOverrides={[
						shorterBoxMargin,
						!isRecurringContribution ? lengthenBoxMargin : css``,
					]}
				>
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
										if (availablePaymentMethods) {
											setStripeExpressCheckoutReady(true);
										}
									}}
									onClick={({ resolve }) => {
										/** @see https://docs.stripe.com/elements/express-checkout-element/accept-a-payment?locale=en-GB#handle-click-event */
										const options = {
											emailRequired: true,
										};

										// Track payment method selection with QM
										sendEventPaymentMethodSelected(
											'StripeExpressCheckoutElement',
										);

										resolve(options);
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

										const name = event.billingDetails?.name ?? '';

										/**
										 * splits by the last space, and uses the head as firstName
										 * and tail as lastName
										 */
										const firstName = name
											.substring(0, name.lastIndexOf(' ') + 1)
											.trim();
										const lastName = name
											.substring(name.lastIndexOf(' ') + 1, name.length)
											.trim();
										setFirstName(firstName);
										setLastName(lastName);

										event.billingDetails?.address.postal_code &&
											setBillingPostcode(
												event.billingDetails.address.postal_code,
											);

										if (
											!event.billingDetails?.address.state &&
											countriesRequiringBillingState.includes(countryId)
										) {
											logException(
												"Could not find state from Stripe's billingDetails",
												{ geoId, countryGroupId, countryId },
											);
										}
										event.billingDetails?.address.state &&
											setBillingState(event.billingDetails.address.state);

										event.billingDetails?.email &&
											setEmail(event.billingDetails.email);
										event.billingDetails?.email &&
											setConfirmedEmail(event.billingDetails.email);

										setPaymentMethod('StripeExpressCheckoutElement');
										setStripeExpressCheckoutPaymentType(
											event.expressPaymentType,
										);
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
						{postStripeCheckoutErrorMessage && (
							<div role="alert" data-qm-error ref={scrollToViewRef}>
								<ErrorSummary
									cssOverrides={css`
										margin-bottom: ${space[6]}px;
									`}
									message={'Sorry, something went wrong'}
									context={postStripeCheckoutErrorMessage}
								/>
							</div>
						)}

						{isWeeklyGift && (
							<>
								<WeeklyGiftPersonalFields
									legend={`1. Gift recipient's details`}
									recipientFirstName={recipientFirstName}
									setRecipientFirstName={setRecipientFirstName}
									recipientLastName={recipientLastName}
									setRecipientLastName={setRecipientLastName}
									recipientEmail={recipientEmail}
									setRecipientEmail={setRecipientEmail}
								/>
								<WeeklyDeliveryDates
									legend={`2. Gift delivery date`}
									weeklyDeliveryDates={getWeeklyDays()}
									weeklyDeliveryDate={weeklyDeliveryDate}
									setWeeklyDeliveryDate={setWeeklyDeliveryDate}
								/>
								<PersonalAddressFields
									countryId={countryId}
									countries={productDescription.deliverableTo}
									checkoutSession={checkoutSession}
									productKey={productKey}
									deliveryPostcodeIsOutsideM25={deliveryPostcodeIsOutsideM25}
									deliveryPostcode={deliveryPostcode}
									setDeliveryPostcode={setDeliveryPostcode}
									chosenDeliveryAgent={chosenDeliveryAgent}
									setChosenDeliveryAgent={setChosenDeliveryAgent}
									deliveryAgents={deliveryAgents}
									deliveryAgentError={deliveryAgentError}
									setDeliveryAgentError={setDeliveryAgentError}
									deliveryAddressErrors={deliveryAddressErrors}
									setDeliveryAddressErrors={setDeliveryAddressErrors}
								/>
							</>
						)}

						<PersonalDetailsFields
							countryId={countryId}
							countries={productDescription.deliverableTo}
							legend={legendPersonalDetails}
							firstName={firstName}
							setFirstName={setFirstName}
							lastName={lastName}
							setLastName={setLastName}
							email={email}
							setEmail={setEmail}
							confirmedEmail={confirmedEmail}
							setConfirmedEmail={setConfirmedEmail}
							phoneNumber={isWeeklyGift ? phoneNumber : undefined}
							setPhoneNumber={isWeeklyGift ? setPhoneNumber : undefined}
							billingStatePostcode={billingStatePostcode}
							hasDeliveryAddress={hasDeliveryAddress}
							isEmailAddressReadOnly={isSignedIn}
							isSignedIn={isSignedIn}
							isWeeklyGift={isWeeklyGift}
						/>

						{/**
						 * We need the billing-country for all transactions, even non-deliverable ones
						 * which we get from the GU_country cookie which comes from the Fastly geo client.
						 */}
						{!hasDeliveryAddress && (
							<input type="hidden" name="billing-country" value={countryId} />
						)}
						{!isWeeklyGift && hasDeliveryAddress && (
							<PersonalAddressFields
								countryId={countryId}
								countries={productDescription.deliverableTo}
								checkoutSession={checkoutSession}
								productKey={productKey}
								deliveryPostcodeIsOutsideM25={deliveryPostcodeIsOutsideM25}
								deliveryPostcode={deliveryPostcode}
								setDeliveryPostcode={setDeliveryPostcode}
								chosenDeliveryAgent={chosenDeliveryAgent}
								setChosenDeliveryAgent={setChosenDeliveryAgent}
								deliveryAgents={deliveryAgents}
								deliveryAgentError={deliveryAgentError}
								setDeliveryAgentError={setDeliveryAgentError}
								deliveryAddressErrors={deliveryAddressErrors}
								setDeliveryAddressErrors={setDeliveryAddressErrors}
								billingStatePostcode={billingStatePostcode}
							/>
						)}

						<FormSection ref={paymentMethodRef}>
							<Legend>
								{legendPayment}
								<SecureTransactionIndicator
									hideText={true}
									cssOverrides={css``}
								/>
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
															{label}
															<div
																css={css`
																	max-height: ${size.xsmall}px;
																`}
															>
																{icon}
															</div>
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

											{validPaymentMethod === 'DirectDebit' && selected && (
												<div
													css={css`
														padding: ${space[5]}px ${space[3]}px ${space[6]}px;
													`}
												>
													<DirectDebitForm
														countryGroupId={countryGroupId}
														accountHolderName={accountHolderName}
														accountNumber={accountNumber}
														accountHolderConfirmation={
															accountHolderConfirmation
														}
														sortCode={sortCode}
														recaptchaCompleted={false}
														isSundayOnly={isSundayOnly}
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
																	setRecaptchaToken(undefined);
																}}
															/>
														}
														formError={''}
														errors={{
															recaptcha: maybeArrayWrap(
																directDebitFieldError.recaptcha,
															),
														}}
													/>
												</div>
											)}
										</PaymentMethodSelector>
									);
								})}
							</RadioGroup>
						</FormSection>
						<div
							css={css`
								margin: ${space[6]}px 0;
							`}
						>
							{showSimilarProductsConsentForRatePlan(
								productDescription,
								ratePlanKey,
							) && <SimilarProductsConsent />}
						</div>
						<SummaryTsAndCs
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							currency={currencyKey}
							amount={originalAmount}
						/>
						<div
							css={css`
								margin: ${space[8]}px 0;
							`}
						>
							<SubmitButton
								paymentMethod={paymentMethod}
								payPalLoaded={payPalLoaded}
								payPalBAID={payPalBAID}
								setPayPalBAID={setPayPalBAID}
								formRef={formRef}
								isTestUser={isTestUser}
								finalAmount={finalAmount}
								currencyKey={currencyKey}
								billingPeriod={billingPeriod}
								csrf={csrf.token ?? ''}
								currency={currency}
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
						<PaymentTsAndCs
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							countryGroupId={countryGroupId}
							promotion={promotion}
							thresholdAmount={thresholdAmount}
						/>
					</BoxContents>
				</Box>
			</form>
			{isRecurringContribution && (
				<>
					<PatronsMessage
						countryGroupId={countryGroupId}
						mobileTheme={'light'}
					/>
					<ContributionCheckoutFinePrint mobileTheme={'light'} />
				</>
			)}
			{isProcessingPayment && (
				<CheckoutLoadingOverlay
					hideProcessingMessage={isRedirectingToStripeHostedCheckout}
				/>
			)}
		</>
	);
}
