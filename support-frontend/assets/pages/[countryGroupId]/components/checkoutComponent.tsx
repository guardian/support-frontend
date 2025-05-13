import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	Checkbox,
	Label,
	Radio,
	RadioGroup,
	TextArea,
	TextInput,
} from '@guardian/source/react-components';
import {
	Divider,
	ErrorSummary,
	InfoSummary,
} from '@guardian/source-development-kitchen/react-components';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import {
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { checkAccount } from 'components/directDebit/helpers/ajax';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	OrderSummaryStartDate,
	OrderSummaryTsAndCs,
} from 'components/orderSummary/orderSummaryTsAndCs';
import { paymentMethodData } from 'components/paymentMethodSelector/paymentMethodData';
import { StateSelect } from 'components/personalDetails/stateSelect';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
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
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import {
	type ActiveProductKey,
	productCatalogDescription,
	productCatalogDescriptionNewBenefits,
	showSimilarProductsConsentForRatePlan,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { useAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import { getLowerProductBenefitThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { ContributionCheckoutFinePrint } from 'pages/supporter-plus-landing/components/contributionCheckoutFinePrint';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { PaymentTsAndCs } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import { SummaryTsAndCs } from 'pages/supporter-plus-landing/components/summaryTsAndCs';
import { postcodeIsWithinDeliveryArea } from '../../../helpers/forms/deliveryCheck';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import { isValidPostcode } from '../../../helpers/forms/formValidation';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { formatUserDate } from '../../../helpers/utilities/dateConversions';
import { DeliveryAgentsSelect } from '../../paper-subscription-checkout/components/deliveryAgentsSelect';
import { getTierThreeDeliveryDate } from '../../weekly-subscription-checkout/helpers/deliveryDays';
import { PersonalDetailsFields } from '../checkout/components/PersonalDetailsFields';
import {
	getBenefitsChecklistFromLandingPageTool,
	getBenefitsChecklistFromProductDescription,
} from '../checkout/helpers/benefitsChecklist';
import type { DeliveryAgentsResponse } from '../checkout/helpers/getDeliveryAgents';
import { getDeliveryAgents } from '../checkout/helpers/getDeliveryAgents';
import { getProductFields } from '../checkout/helpers/getProductFields';
import type { CheckoutSession } from '../checkout/helpers/stripeCheckoutSession';
import { isSundayOnlyNewspaperSub } from '../helpers/isSundayOnlyNewspaperSub';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from '../validation';
import { BackButton } from './backButton';
import { CheckoutLayout } from './checkoutLayout';
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

const countriesRequiringBillingState = ['US', 'CA', 'AU'];

function paymentMethodIsActive(paymentMethod: LegacyPaymentMethod) {
	return isSwitchOn(
		`recurringPaymentMethods.${toPaymentMethodSwitchNaming(paymentMethod)}`,
	);
}

type CheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	stripePublicKey: string;
	isTestUser: boolean;
	productKey: ActiveProductKey;
	ratePlanKey: string;
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
};

const getPaymentMethods = (
	countryId: IsoCountry,
	productKey: ProductKey,
	ratePlanKey: string,
) => {
	const maybeDirectDebit = countryId === 'GB' && DirectDebit;

	if (isSundayOnlyNewspaperSub(productKey, ratePlanKey)) {
		return [maybeDirectDebit, StripeHostedCheckout];
	}

	return [maybeDirectDebit, Stripe, PayPal];
};

export function CheckoutComponent({
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
	forcedCountry,
	abParticipations,
	landingPageSettings,
	checkoutSession,
}: CheckoutComponentProps) {
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
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey] ?? {
		billingPeriod: 'Monthly',
	};
	const isSundayOnly = isSundayOnlyNewspaperSub(productKey, ratePlanKey);
	const isRecurringContribution = productKey === 'Contribution';

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

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(
		checkoutSession ? StripeHostedCheckout : undefined,
	);
	const [paymentMethodError, setPaymentMethodError] = useState<string>();

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
	const [firstName, setFirstName] = useState(
		checkoutSession?.formFields.personalData.firstName ?? user?.firstName ?? '',
	);
	const [lastName, setLastName] = useState(
		checkoutSession?.formFields.personalData.lastName ?? user?.lastName ?? '',
	);
	const [email, setEmail] = useState(
		checkoutSession?.formFields.personalData.email ?? user?.email ?? '',
	);
	const [confirmedEmail, setConfirmedEmail] = useState(
		checkoutSession?.formFields.personalData.email ?? '',
	);

	/** Delivery Instructions */
	const [deliveryInstructions, setDeliveryInstructions] = useState(
		checkoutSession?.formFields.deliveryInstructions ?? '',
	);

	/** Delivery and billing addresses */
	const [deliveryPostcode, setDeliveryPostcode] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.postCode ?? '',
	);
	const [deliveryLineOne, setDeliveryLineOne] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.lineOne ?? '',
	);
	const [deliveryLineTwo, setDeliveryLineTwo] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.lineTwo ?? '',
	);
	const [deliveryCity, setDeliveryCity] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.city ?? '',
	);
	const [deliveryState, setDeliveryState] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.state ?? '',
	);
	const [deliveryPostcodeStateResults, setDeliveryPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [deliveryPostcodeStateLoading, setDeliveryPostcodeStateLoading] =
		useState(false);
	const [deliveryCountry, setDeliveryCountry] = useState(
		checkoutSession?.formFields.addressFields.deliveryAddress?.country ??
			countryId,
	);
	const [deliveryAddressErrors, setDeliveryAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const fetchDeliveryAgentsIfRequired = async (postcode: string) => {
		if (isValidPostcode(postcode)) {
			if (postcodeIsWithinDeliveryArea(postcode)) {
				// The user's postcode is inside the M25
				setDeliveryPostcodeIsOutsideM25(false);
			} else if (ratePlanKey === 'Saturday' || ratePlanKey === 'Sunday') {
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

	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useState(checkoutSession?.formFields.billingAddressMatchesDelivery ?? true);

	const [billingPostcode, setBillingPostcode] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.postCode ?? '',
	);
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();
	const [billingLineOne, setBillingLineOne] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.lineOne ?? '',
	);
	const [billingLineTwo, setBillingLineTwo] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.lineTwo ?? '',
	);
	const [billingCity, setBillingCity] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.city ?? '',
	);
	const [billingStateError, setBillingStateError] = useState<string>();
	/**
	 * BillingState selector initialised to undefined to hide
	 * billingStateError message. formOnSubmit checks and converts to
	 * empty string to display billingStateError message.
	 */
	const [billingState, setBillingState] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.state ?? '',
	);
	const [billingPostcodeStateResults, setBillingPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);
	const [billingCountry, setBillingCountry] = useState(
		checkoutSession?.formFields.addressFields.billingAddress.country ??
			countryId,
	);
	const [billingAddressErrors, setBillingAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const formRef = useRef<HTMLFormElement>(null);

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

	const { supportInternationalisationId } = countryGroups[countryGroupId];

	const onFormSubmit = async (formData: FormData) => {
		if (paymentMethod === undefined) {
			setPaymentMethodError('Please select a payment method');
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
				hasDeliveryAddress: !!productDescription.deliverableTo,
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
		}
		setIsProcessingPayment(false);
	};

	useAbandonedBasketCookie(
		productKey,
		originalAmount,
		ratePlanDescription.billingPeriod,
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
	);

	const billingPeriod = productFields.billingPeriod;
	/*
  TODO :  Passed down because minimum product prices are unavailable in the paymentTsAndCs story
          We should revisit this and see if we can remove this prop, pushing it lower down the tree
  */
	const thresholdAmount = getLowerProductBenefitThreshold(
		billingPeriod,
		fromCountryGroupId(countryGroupId),
		countryGroupId,
		productKey,
	);

	return (
		<CheckoutLayout>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{forcedCountry &&
						productDescription.deliverableTo?.[forcedCountry] && (
							<div role="alert">
								<InfoSummary
									cssOverrides={css`
										margin-bottom: ${space[6]}px;
									`}
									message={`You've changed your delivery country to ${productDescription.deliverableTo[forcedCountry]}.`}
									context={`Your subscription price has been updated to reflect the rates in your new location.`}
								/>
							</div>
						)}
					<ContributionsOrderSummary
						productKey={productKey}
						productDescription={productDescription.label}
						ratePlanKey={ratePlanKey}
						ratePlanDescription={ratePlanDescription.label}
						paymentFrequency={
							ratePlanDescription.billingPeriod === 'Annual'
								? 'year'
								: ratePlanDescription.billingPeriod === 'Monthly'
								? 'month'
								: 'quarter'
						}
						amount={originalAmount}
						promotion={promotion}
						currency={currency}
						checkListData={
							getBenefitsChecklistFromLandingPageTool(
								productKey,
								landingPageSettings,
							) ??
							getBenefitsChecklistFromProductDescription(
								productDescription,
								countryGroupId,
								abParticipations,
							)
						}
						onCheckListToggle={(isOpen) => {
							trackComponentClick(
								`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
							);
						}}
						enableCheckList={true}
						startDate={
							<OrderSummaryStartDate
								productKey={productKey}
								startDate={formatUserDate(getTierThreeDeliveryDate())}
							/>
						}
						tsAndCs={
							<OrderSummaryTsAndCs
								productKey={productKey}
								billingPeriod={billingPeriod}
								countryGroupId={countryGroupId}
								thresholdAmount={thresholdAmount}
								promotion={promotion}
							/>
						}
						headerButton={
							<BackButton
								path={`/${geoId}${productDescription.landingPagePath}`}
								buttonText={'Change'}
							/>
						}
					/>
				</BoxContents>
			</Box>
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
						<FormSection>
							<Legend>1. Your details</Legend>

							<PersonalDetailsFields
								isEmailAddressReadOnly={isSignedIn}
								firstName={firstName}
								setFirstName={(firstName) => setFirstName(firstName)}
								lastName={lastName}
								setLastName={(lastName) => setLastName(lastName)}
								email={email}
								setEmail={(email) => setEmail(email)}
								confirmedEmail={confirmedEmail}
								setConfirmedEmail={(confirmedEmail) =>
									setConfirmedEmail(confirmedEmail)
								}
								isSignedIn={isSignedIn}
								showSimilarProductsConsent={
									abParticipations.similarProductsConsent === 'VariantA' &&
									showSimilarProductsConsentForRatePlan(
										productDescription,
										ratePlanKey,
									)
								}
							/>

							{/**
							 * We require state for non-deliverable products as we use different taxes within those regions upstream
							 * For deliverable products we take the state and zip code with the delivery address
							 */}
							{countriesRequiringBillingState.includes(countryId) &&
								!productDescription.deliverableTo && (
									<StateSelect
										countryId={countryId}
										state={billingState}
										onStateChange={(event) => {
											setBillingState(event.currentTarget.value);
										}}
										onBlur={(event) => {
											event.currentTarget.checkValidity();
										}}
										onInvalid={(event) => {
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setBillingStateError(undefined);
											} else {
												setBillingStateError(
													'Please enter a state, province or territory.',
												);
											}
										}}
										error={billingStateError}
									/>
								)}
							{countryId === 'US' && !productDescription.deliverableTo && (
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
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setBillingPostcodeError(undefined);
											} else {
												if (validityState.patternMismatch) {
													setBillingPostcodeError(
														'Please enter a valid zip code.',
													);
												}
											}
										}}
										// We have seen this field be filled in with an email address
										autoComplete={'off'}
									/>
								</div>
							)}
						</FormSection>
						<CheckoutDivider spacing="loose" />
						{/**
						 * We need the billing-country for all transactions, even non-deliverable ones
						 * which we get from the GU_country cookie which comes from the Fastly geo client.
						 */}
						{!productDescription.deliverableTo && (
							<input type="hidden" name="billing-country" value={countryId} />
						)}
						{productDescription.deliverableTo && (
							<>
								<fieldset>
									<Legend>2. Delivery address</Legend>
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
											void findAddressesForPostcode(postcode).then(
												(results) => {
													setDeliveryPostcodeStateLoading(false);
													setDeliveryPostcodeStateResults(results);
												},
											);
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
												void findAddressesForPostcode(postcode).then(
													(results) => {
														setBillingPostcodeStateLoading(false);
														setBillingPostcodeStateResults(results);
													},
												);
											}}
										/>
									</fieldset>
								)}

								<CheckoutDivider spacing="loose" />
							</>
						)}
						{deliveryPostcodeIsOutsideM25 && (
							<FormSection>
								<Legend>3. Delivery Agent</Legend>
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
						<FormSection>
							<Legend>
								{productDescription.deliverableTo
									? deliveryPostcodeIsOutsideM25
										? '4'
										: '3'
									: '2'}
								. Payment method
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
															<div>{icon}</div>
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
														errors={{}}
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
							{abParticipations.similarProductsConsent === 'VariantB' &&
								showSimilarProductsConsentForRatePlan(
									productDescription,
									ratePlanKey,
								) && (
									<SimilarProductsConsent productConsent="similarProductsConsent" />
								)}
						</div>
						<SummaryTsAndCs
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							billingPeriod={billingPeriod}
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
								ratePlanDescription={ratePlanDescription}
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
							billingPeriod={billingPeriod}
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
		</CheckoutLayout>
	);
}
