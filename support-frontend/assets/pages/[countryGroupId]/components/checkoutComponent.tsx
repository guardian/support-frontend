import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Checkbox, Label, TextInput } from '@guardian/source/react-components';
import {
	ErrorSummary,
	InfoSummary,
} from '@guardian/source-development-kitchen/react-components';
import {
	CardNumberElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	getTermsConditions,
	getTermsStartDateTier3,
} from 'components/orderSummary/contributionsOrderSummaryContainer';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { PayPalButton } from 'components/payPalPaymentButton/payPalButton';
import { StateSelect } from 'components/personalDetails/stateSelect';
import Signout from 'components/signout/signout';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import {
	init as abTestInit,
	getAmountsTestVariant,
} from 'helpers/abTests/abtest';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import {
	appropriateErrorMessage,
	type ErrorReason,
} from 'helpers/forms/errorReasons';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type {
	RegularPaymentFields,
	RegularPaymentRequest,
	StatusResponse,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	DirectDebit,
	type PaymentMethod as LegacyPaymentMethod,
	PayPal,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import {
	filterBenefitByABTest,
	filterBenefitByRegion,
	productCatalogDescription,
	productCatalogDescriptionNewBenefits,
	type ProductKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { useAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { isProd } from 'helpers/urls/url';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import {
	PaymentTsAndCs,
	SummaryTsAndCs,
} from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import { LoadingDots } from '../../../../stories/animations/LoadingDots.stories';
import {
	formatMachineDate,
	formatUserDate,
} from '../../../helpers/utilities/dateConversions';
import { getTierThreeDeliveryDate } from '../../weekly-subscription-checkout/helpers/deliveryDays';
import { PersonalDetailsFields } from '../checkout/components/PersonalDetailsFields';
import {
	extractDeliverableAddressDataFromForm,
	extractNonDeliverableAddressDataFromForm,
	extractPersonalDataFromForm,
} from '../checkout/helpers/formDataExtractors';
import { getProductFields } from '../checkout/helpers/getProductFields';
import {
	paypalOneClickCheckout,
	setupPayPalPayment,
} from '../checkout/helpers/paypal';
import { stripeCreateSetupIntentPrb } from '../checkout/helpers/stripe';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from '../validation';
import { BackButton } from './backButton';
import { CheckoutLayout } from './checkoutLayout';
import { FormSection, Legend, shorterBoxMargin } from './form';
import { retryPaymentStatus } from './retryPaymentStatus';
import { setThankYouOrder, unsetThankYouOrder } from './thankYouComponent';

const PaymentSection = lazy(() => import('./paymentSection'));
const ExpressCheckout = lazy(() => import('./expressCheckout'));
/**
 * We have not added StripeExpressCheckoutElement to the old PaymentMethod
 * as it is heavily coupled through the code base and would require adding
 * a lot of extra unused code to those coupled areas.
 */
type PaymentMethod = LegacyPaymentMethod | 'StripeExpressCheckoutElement';
const countriesRequiringBillingState = ['US', 'CA', 'AU'];

/**
/**
 * Attempt to submit a payment to the server. The response will be either `success`, `failure` or `pending`.
 * If it is pending, we keep polling until we get either a success or failure response, or we reach the
 * maximum number of retries. Reaching the maximum number of retries is treated as a success, as we assume
 * that the job has been delayed, but will complete successfully in the future and if it doesn't, then the
 * user will be emailed.
 */
type ProcessPaymentResponse =
	| { status: 'success' }
	| { status: 'failure'; failureReason?: ErrorReason };

type CreateSubscriptionResponse = StatusResponse & {
	userType: UserType;
};

const processPaymentWithRetries = async (
	statusResponse: StatusResponse,
): Promise<ProcessPaymentResponse> => {
	const { trackingUri, status } = statusResponse;
	if (status === 'success' || status === 'failure') {
		return handlePaymentStatus(statusResponse);
	}
	const getTrackingStatus = () =>
		fetch(trackingUri, {
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => response.json() as unknown as StatusResponse);

	return retryPaymentStatus(getTrackingStatus).then((response) =>
		handlePaymentStatus(response),
	);
};

const handlePaymentStatus = (
	statusResponse: StatusResponse,
): ProcessPaymentResponse => {
	const { status, failureReason } = statusResponse;
	if (status === 'failure') {
		return { status, failureReason };
	} else {
		return { status: 'success' }; // success or pending
	}
};

type CheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	stripePublicKey: string;
	isTestUser: boolean;
	productKey: ProductKey;
	ratePlanKey: string;
	originalAmount: number;
	discountedAmount?: number;
	contributionAmount?: number;
	finalAmount: number;
	promotion?: Promotion;
	useStripeExpressCheckout: boolean;
	countryId: IsoCountry;
	forcedCountry?: string;
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
}: CheckoutComponentProps) {
	/** we unset any previous orders that have been made */
	unsetThankYouOrder();

	const csrf = appConfig.csrf.token;
	const user = appConfig.user;
	const isSignedIn = !!user?.email;

	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const abParticipations = abTestInit({ countryId, countryGroupId });
	const showNewspaperArchiveBenefit = ['v1', 'v2', 'control'].includes(
		abParticipations.newspaperArchiveBenefit ?? '',
	);

	const productDescription = showNewspaperArchiveBenefit
		? productCatalogDescriptionNewBenefits(countryGroupId)[productKey]
		: productCatalogDescription[productKey];
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey];

	const productFields = getProductFields({
		product: {
			productKey,
			productDescription,
			ratePlanKey,
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
	if (productKey === 'Contribution') {
		const supporterPlusRatePlanPrice =
			productCatalog.SupporterPlus.ratePlans[ratePlanKey].pricing[currencyKey];

		const { selectedAmountsVariant } = getAmountsTestVariant(
			countryId,
			countryGroupId,
			appConfig.settings,
		);
		if (originalAmount < 1) {
			isInvalidAmount = true;
		}
		if (!isContributionsOnlyCountry(selectedAmountsVariant)) {
			if (originalAmount >= supporterPlusRatePlanPrice) {
				isInvalidAmount = true;
			}
		}
	}

	if (isInvalidAmount) {
		return <div>Invalid Amount {originalAmount}</div>;
	}

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
	const [paymentMethodError, setPaymentMethodError] = useState<string>();

	/** Payment methods: Stripe */
	const stripe = useStripe();
	const elements = useElements();
	const cardElement = elements?.getElement(CardNumberElement);
	const [stripeClientSecret, setStripeClientSecret] = useState<string>();
	const [
		stripeExpressCheckoutPaymentType,
		setStripeExpressCheckoutPaymentType,
	] = useState<ExpressPaymentType>();
	const [stripeExpressCheckoutSuccessful, setStripeExpressCheckoutSuccessful] =
		useState(false);
	useEffect(() => {
		if (stripeExpressCheckoutSuccessful) {
			formRef.current?.requestSubmit();
		}
	}, [stripeExpressCheckoutSuccessful]);

	/**
	 * flag that disables the submission of the form until the stripeClientSecret is
	 * fetched from the Stripe API with using the reCaptcha token
	 */
	const [stripeClientSecretInProgress, setStripeClientSecretInProgress] =
		useState(false);

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
	useEffect(() => {
		if (paymentMethod === 'PayPal' && !payPalLoaded) {
			void loadPayPalRecurring().then(() => setPayPalLoaded(true));
		}
	}, [paymentMethod, payPalLoaded]);

	/** Recaptcha */
	const [recaptchaToken, setRecaptchaToken] = useState<string>();

	/** Personal details */
	const [firstName, setFirstName] = useState(user?.firstName ?? '');
	const [lastName, setLastName] = useState(user?.lastName ?? '');
	const [email, setEmail] = useState(user?.email ?? '');

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
	const [deliveryAddressErrors, setDeliveryAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const [billingAddressMatchesDelivery, setBillingAddressMatchesDelivery] =
		useState(true);

	const [billingPostcode, setBillingPostcode] = useState('');
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();
	const [billingLineOne, setBillingLineOne] = useState('');
	const [billingLineTwo, setBillingLineTwo] = useState('');
	const [billingCity, setBillingCity] = useState('');
	const [billingStateError, setBillingStateError] = useState<string>();
	/**
	 * BillingState selector initialised to undefined to hide
	 * billingStateError message. formOnSubmit checks and converts to
	 * empty string to display billingStateError message.
	 */
	const [billingState, setBillingState] = useState('');
	const [billingPostcodeStateResults, setBillingPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [billingPostcodeStateLoading, setBillingPostcodeStateLoading] =
		useState(false);
	const [billingCountry, setBillingCountry] = useState(countryId);
	const [billingAddressErrors, setBillingAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	const formRef = useRef<HTMLFormElement>(null);

	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	/** General error that can occur via fetch validations */
	const [errorMessage, setErrorMessage] = useState<string>();
	const [errorContext, setErrorContext] = useState<string>();

	const formOnSubmit = async (formData: FormData) => {
		setIsProcessingPayment(true);
		/**
		 * The validation for this is currently happening on the client side form validation
		 * So we'll assume strings are not null.
		 * see: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
		 */

		const personalData = extractPersonalDataFromForm(formData);

		/**
		 * FormData: address
		 * `billingAddress` is required for all products, but we only ever need to the country field populated.
		 *
		 * For products that have a `deliveryAddress`, we collect that and either copy it in `billingAddress`
		 * or allow a person to enter it manually.
		 */
		const { billingAddress, deliveryAddress } = productDescription.deliverableTo
			? extractDeliverableAddressDataFromForm(formData)
			: extractNonDeliverableAddressDataFromForm(formData);

		if (paymentMethod === undefined) {
			setPaymentMethodError('Please select a payment method');
		}

		/** FormData: `paymentFields` */
		let paymentFields: RegularPaymentFields | undefined = undefined;
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
				setErrorMessage('There was an issue with your card details.');
				setErrorContext(
					appropriateErrorMessage(stripeIntentResult.error.decline_code ?? ''),
				);
				console.error(stripeIntentResult.error);
			} else if (stripeIntentResult.setupIntent.payment_method) {
				paymentFields = {
					paymentType: Stripe,
					stripePublicKey,
					stripePaymentType: 'StripeCheckout' as StripePaymentMethod,
					paymentMethod: stripeIntentResult.setupIntent
						.payment_method as string,
				};
			}
		}

		if (
			paymentMethod === 'StripeExpressCheckoutElement' &&
			stripe &&
			elements
		) {
			/** 1. Get a clientSecret from our server from the stripePublicKey */
			const stripeClientSecret = await stripeCreateSetupIntentPrb(
				stripePublicKey,
			);

			/** 2. Get the Stripe paymentMethod from the Stripe elements */
			const { paymentMethod: stripePaymentMethod, error: paymentMethodError } =
				await stripe.createPaymentMethod({
					elements,
				});

			if (paymentMethodError) {
				setErrorMessage('There was an issue with wallet.');
				setErrorContext(
					appropriateErrorMessage(paymentMethodError.decline_code ?? ''),
				);
				return;
			}

			/** 3. Get the setupIntent from the paymentMethod */
			const { setupIntent, error: cardSetupError } =
				await stripe.confirmCardSetup(stripeClientSecret, {
					payment_method: stripePaymentMethod.id,
				});

			if (cardSetupError) {
				setErrorMessage('There was an issue with wallet.');
				setErrorContext(
					appropriateErrorMessage(cardSetupError.decline_code ?? ''),
				);
				return;
			}

			const stripePaymentType: StripePaymentMethod =
				stripeExpressCheckoutPaymentType === 'apple_pay'
					? 'StripeApplePay'
					: 'StripePaymentRequestButton';

			/** 4. Pass the setupIntent through to the paymentFields sent to our /create endpoint */
			paymentFields = {
				paymentType: Stripe,
				paymentMethod: setupIntent.payment_method as string,
				stripePaymentType,
				stripePublicKey,
			};
		}

		if (paymentMethod === 'PayPal') {
			paymentFields = {
				paymentType: PayPal,
				baid: formData.get('payPalBAID') as string,
			};
		}

		if (paymentMethod === 'DirectDebit' && recaptchaToken !== undefined) {
			paymentFields = {
				paymentType: DirectDebit,
				accountHolderName: formData.get('accountHolderName') as string,
				accountNumber: formData.get('accountNumber') as string,
				sortCode: formData.get('sortCode') as string,
				recaptchaToken,
			};
		}

		/** Form: tracking data  */
		const ophanIds = getOphanIds();
		const referrerAcquisitionData = {
			...getReferrerAcquisitionData(),
			labels: ['generic-checkout'],
		};

		if (stripeExpressCheckoutPaymentType === 'link') {
			referrerAcquisitionData.labels.push('express-checkout-link');
		}

		if (paymentMethod && paymentFields) {
			/** TODO
			 * - add debugInfo
			 */
			const firstDeliveryDate =
				productKey === 'TierThree'
					? formatMachineDate(getTierThreeDeliveryDate())
					: null;

			const promoCode = promotion?.promoCode;
			const appliedPromotion =
				promoCode !== undefined
					? {
							promoCode,
							countryGroupId: geoId,
					  }
					: undefined;
			const supportAbTests = getSupportAbTests(abParticipations);
			const createSupportWorkersRequest: RegularPaymentRequest = {
				...personalData,
				billingAddress,
				deliveryAddress,
				firstDeliveryDate,
				paymentFields,
				appliedPromotion,
				ophanIds,
				referrerAcquisitionData,
				product: productFields,
				supportAbTests,
				debugInfo: '',
			};
			setErrorMessage(undefined);
			setErrorContext(undefined);

			const createResponse = await fetch('/subscribe/create', {
				method: 'POST',
				body: JSON.stringify(createSupportWorkersRequest),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			let processPaymentResponse: ProcessPaymentResponse;
			let userType: UserType | undefined;

			if (createResponse.ok) {
				const statusResponse =
					(await createResponse.json()) as CreateSubscriptionResponse;
				userType = statusResponse.userType;
				processPaymentResponse = await processPaymentWithRetries(
					statusResponse,
				);
			} else {
				const errorReason = (await createResponse.text()) as ErrorReason;
				processPaymentResponse = {
					status: 'failure',
					failureReason: errorReason,
				};
			}

			if (processPaymentResponse.status === 'success') {
				const order = {
					firstName: personalData.firstName,
					email: personalData.email,
					paymentMethod: paymentMethod,
				};
				setThankYouOrder(order);
				const thankYouUrlSearchParams = new URLSearchParams();
				thankYouUrlSearchParams.set('product', productKey);
				thankYouUrlSearchParams.set('ratePlan', ratePlanKey);
				promoCode && thankYouUrlSearchParams.set('promoCode', promoCode);
				userType && thankYouUrlSearchParams.set('userType', userType);

				contributionAmount &&
					thankYouUrlSearchParams.set(
						'contribution',
						contributionAmount.toString(),
					);

				window.location.href = `/${geoId}/thank-you?${thankYouUrlSearchParams.toString()}`;
			} else {
				console.error(
					'processPaymentResponse error:',
					processPaymentResponse.failureReason,
				);
				setErrorMessage('Sorry, something went wrong.');
				setErrorContext(
					appropriateErrorMessage(
						processPaymentResponse.failureReason ?? 'unknown',
					),
				);
				setIsProcessingPayment(false);
			}
		} else {
			setIsProcessingPayment(false);
		}
	};

	const { supportInternationalisationId } = countryGroups[countryGroupId];

	useAbandonedBasketCookie(
		productKey,
		originalAmount,
		ratePlanDescription.billingPeriod,
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
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
						description={productDescription.label}
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
						checkListData={[
							...productDescription.benefits
								.filter((benefit) =>
									filterBenefitByRegion(benefit, countryGroupId),
								)
								.filter((benefit) =>
									filterBenefitByABTest(benefit, abParticipations),
								)
								.map((benefit) => ({
									isChecked: true,
									text: benefit.copy,
								})),
							...(productDescription.benefitsAdditional ?? [])
								.filter((benefit) =>
									filterBenefitByRegion(benefit, countryGroupId),
								)
								.filter((benefit) =>
									filterBenefitByABTest(benefit, abParticipations),
								)
								.map((benefit) => ({
									isChecked: true,
									text: benefit.copy,
								})),
							...(productDescription.benefitsMissing ?? [])
								.filter((benefit) =>
									filterBenefitByRegion(benefit, countryGroupId),
								)
								.map((benefit) => ({
									isChecked: false,
									text: benefit.copy,
									maybeGreyedOut: css`
										color: ${palette.neutral[60]};

										svg {
											fill: ${palette.neutral[60]};
										}
									`,
								})),
						]}
						onCheckListToggle={(isOpen) => {
							trackComponentClick(
								`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
							);
						}}
						enableCheckList={true}
						tsAndCsTier3={
							productKey === 'TierThree'
								? getTermsStartDateTier3(
										formatUserDate(getTierThreeDeliveryDate()),
								  )
								: null
						}
						tsAndCs={getTermsConditions(
							countryGroupId,
							productFields.billingPeriod === 'Monthly'
								? 'MONTHLY'
								: productFields.billingPeriod === 'Annual'
								? 'ANNUAL'
								: 'ONE_OFF',
							productFields.productType,
							promotion,
						)}
						headerButton={
							productKey === 'GuardianLight' ? (
								<BackButton path={`/guardian-light`} buttonText="Back" />
							) : (
								<BackButton path={`/${geoId}/contribute`} buttonText="Change" />
							)
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
					/** we defer this to an external function as a lot of the payment methods use async */
					void formOnSubmit(formData);

					return false;
				}}
			>
				<Box cssOverrides={shorterBoxMargin}>
					<BoxContents>
						{useStripeExpressCheckout && (
							<Suspense fallback={<></>}>
								<ExpressCheckout
									setStripeExpressCheckoutPaymentType={
										setStripeExpressCheckoutPaymentType
									}
									stripe={stripe}
									elements={elements}
									setErrorMessage={setErrorMessage}
									setFirstName={setFirstName}
									setLastName={setLastName}
									setBillingPostcode={setBillingPostcode}
									setBillingState={setBillingState}
									setEmail={setEmail}
									setPaymentMethod={setPaymentMethod}
									setStripeExpressCheckoutSuccessful={
										setStripeExpressCheckoutSuccessful
									}
									countryId={countryId}
									geoId={geoId}
									countryGroupId={countryGroupId}
								/>
							</Suspense>
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
							>
								<Signout isSignedIn={isSignedIn} />
							</PersonalDetailsFields>

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

						<Suspense fallback={<LoadingDots appearance={'dark'} />}>
							<PaymentSection
								paymentMethodError={paymentMethodError}
								setPaymentMethodError={setPaymentMethodError}
								setStripeClientSecret={setStripeClientSecret}
								setStripeClientSecretInProgress={
									setStripeClientSecretInProgress
								}
								recaptchaToken={recaptchaToken}
								setRecaptchaToken={setRecaptchaToken}
								paymentMethod={paymentMethod}
								setPaymentMethod={setPaymentMethod}
								sectionNumber={productDescription.deliverableTo ? 3 : 2}
								stripePublicKey={stripePublicKey}
								isTestUser={isTestUser}
								countryGroupId={countryGroupId}
								countryId={countryId}
							/>
						</Suspense>
						<SummaryTsAndCs
							contributionType={
								productFields.billingPeriod === 'Monthly'
									? 'MONTHLY'
									: productFields.billingPeriod === 'Annual'
									? 'ANNUAL'
									: 'ONE_OFF'
							}
							currency={currencyKey}
							amount={originalAmount}
							productKey={productKey}
							promotion={promotion}
						/>
						<div
							css={css`
								margin: ${space[8]}px 0;
							`}
						>
							{paymentMethod !== 'PayPal' && (
								<DefaultPaymentButton
									isLoading={stripeClientSecretInProgress}
									buttonText={
										stripeClientSecretInProgress
											? 'Validating reCAPTCHA...'
											: `Pay ${simpleFormatAmount(currency, finalAmount)} per ${
													ratePlanDescription.billingPeriod === 'Annual'
														? 'year'
														: ratePlanDescription.billingPeriod === 'Monthly'
														? 'month'
														: 'quarter'
											  }`
									}
									onClick={() => {
										// no-op
										// This isn't needed because we are now using the formOnSubmit handler
									}}
									type="submit"
									disabled={stripeClientSecretInProgress}
								/>
							)}
							{payPalLoaded && paymentMethod === 'PayPal' && (
								<>
									<input type="hidden" name="payPalBAID" value={payPalBAID} />

									<PayPalButton
										env={isProd() && !isTestUser ? 'production' : 'sandbox'}
										style={{
											color: 'blue',
											size: 'responsive',
											label: 'pay',
											tagline: false,
											layout: 'horizontal',
											fundingicons: false,
										}}
										commit={true}
										validate={({ disable, enable }) => {
											/** We run this initially to set the button to the correct state */
											const valid = formRef.current?.checkValidity();
											if (valid) {
												enable();
											} else {
												disable();
											}

											/** And then run it on form change */
											formRef.current?.addEventListener('change', (event) => {
												const element = event.currentTarget as HTMLFormElement;
												/* We call this twice because the first time does not
                           not give us an accurate state of the form.
                           This seems to be because we use `setCustomValidity` on the elements
                        */
												element.checkValidity();
												const valid = element.checkValidity();

												if (valid) {
													enable();
												} else {
													disable();
												}
											});
										}}
										funding={{
											disallowed: [window.paypal.FUNDING.CREDIT],
										}}
										onClick={() => {
											// TODO - add tracking
										}}
										/** the order is Button.payment(opens PayPal window).then(Button.onAuthorize) */
										payment={(resolve, reject) => {
											setupPayPalPayment(
												finalAmount,
												currencyKey,
												ratePlanDescription.billingPeriod,
												csrf,
											)
												.then((token) => {
													resolve(token);
												})
												.catch((error) => {
													console.error(error);
													reject(error as Error);
												});
										}}
										onAuthorize={(payPalData: Record<string, unknown>) => {
											void paypalOneClickCheckout(
												payPalData.paymentToken,
												csrf,
											).then((baid) => {
												// The state below has a useEffect that submits the form
												setPayPalBAID(baid);
											});
										}}
									/>
								</>
							)}
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
							countryGroupId={countryGroupId}
							contributionType={
								productFields.billingPeriod === 'Monthly'
									? 'MONTHLY'
									: productFields.billingPeriod === 'Annual'
									? 'ANNUAL'
									: 'ONE_OFF'
							}
							currency={currencyKey}
							amount={originalAmount}
							amountIsAboveThreshold={
								productKey === 'SupporterPlus' || productKey === 'TierThree'
							}
							productKey={productKey}
							promotion={promotion}
						/>
					</BoxContents>
				</Box>
			</form>
			<PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
			<GuardianTsAndCs mobileTheme={'light'} displayPatronsCheckout={false} />
			{isProcessingPayment && (
				<LoadingOverlay>
					<p>Processing transaction</p>
					<p>Please wait</p>
				</LoadingOverlay>
			)}
		</CheckoutLayout>
	);
}
