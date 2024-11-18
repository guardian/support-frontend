import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	Checkbox,
	Label,
	Radio,
	RadioGroup,
	TextInput,
} from '@guardian/source/react-components';
import {
	Divider,
	ErrorSummary,
	InfoSummary,
} from '@guardian/source-development-kitchen/react-components';
import {
	CardNumberElement,
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	getTermsConditions,
	getTermsStartDateTier3,
} from 'components/orderSummary/contributionsOrderSummaryContainer';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { paymentMethodData } from 'components/paymentMethodSelector/paymentMethodData';
import { PayPalButton } from 'components/payPalPaymentButton/payPalButton';
import { StateSelect } from 'components/personalDetails/stateSelect';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import Signout from 'components/signout/signout';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
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
	isPaymentMethod,
	type PaymentMethod as LegacyPaymentMethod,
	PayPal,
	Stripe,
	toPaymentMethodSwitchNaming,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
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
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
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
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';
import { isProd } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import {
	PaymentTsAndCs,
	SummaryTsAndCs,
} from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import {
	formatMachineDate,
	formatUserDate,
} from '../../../helpers/utilities/dateConversions';
import { getTierThreeDeliveryDate } from '../../weekly-subscription-checkout/helpers/deliveryDays';
import {
	doesNotContainEmojiPattern,
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
import { setThankYouOrder, unsetThankYouOrder } from './thankyou';

/**
 * We have not added StripeExpressCheckoutElement to the old PaymentMethod
 * as it is heavily coupled through the code base and would require adding
 * a lot of extra unused code to those coupled areas.
 */
type PaymentMethod = LegacyPaymentMethod | 'StripeExpressCheckoutElement';
const countriesRequiringBillingState = ['US', 'CA', 'AU'];

function paymentMethodIsActive(paymentMethod: LegacyPaymentMethod) {
	return isSwitchOn(
		`recurringPaymentMethods.${toPaymentMethodSwitchNaming(paymentMethod)}`,
	);
}

/**
 * This method removes the `pending` state by retrying,
 * resolving on success or failure only.
 */
type ProcessPaymentResponse =
	| { status: 'success' }
	| { status: 'failure'; failureReason?: ErrorReason };

type CreateSubscriptionResponse = StatusResponse & {
	userType: UserType;
};

const processPayment = async (
	statusResponse: StatusResponse,
	geoId: GeoId,
): Promise<ProcessPaymentResponse> => {
	return new Promise((resolve) => {
		const { trackingUri, status, failureReason } = statusResponse;
		if (status === 'success') {
			resolve({ status: 'success' });
		} else if (status === 'failure') {
			resolve({ status, failureReason });
		} else {
			setTimeout(() => {
				void fetch(trackingUri, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((response) => response.json())
					.then((json) => {
						resolve(processPayment(json as StatusResponse, geoId));
					});
			}, 1000);
		}
	});
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

	/**
	 * This is the data structure used by the `/subscribe/create` endpoint.
	 *
	 * This must match the types in `CreateSupportWorkersRequest#product`
	 * and readerRevenueApis - `RegularPaymentRequest#product`.
	 *
	 * We might be able to defer this to the backend.
	 */
	let productFields: RegularPaymentRequest['product'];
	switch (productKey) {
		case 'GuardianLight':
			productFields = {
				productType: 'GuardianLight',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
			};
			break;

		case 'TierThree':
			productFields = {
				productType: 'TierThree',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				fulfilmentOptions:
					ratePlanKey === 'DomesticMonthly' ||
					ratePlanKey === 'DomesticAnnual' ||
					ratePlanKey === 'DomesticMonthlyV2' ||
					ratePlanKey === 'DomesticAnnualV2'
						? 'Domestic'
						: ratePlanKey === 'RestOfWorldMonthly' ||
						  ratePlanKey === 'RestOfWorldAnnual' ||
						  ratePlanKey === 'RestOfWorldMonthlyV2' ||
						  ratePlanKey === 'RestOfWorldAnnualV2'
						? 'RestOfWorld'
						: 'Domestic',
				productOptions: ratePlanKey.endsWith('V2')
					? 'NewspaperArchive'
					: 'NoProductOptions',
			};
			break;

		case 'Contribution':
			productFields = {
				productType: 'Contribution',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				amount: finalAmount,
			};
			break;

		case 'SupporterPlus':
			productFields = {
				productType: 'SupporterPlus',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				/**
				 * We shouldn't have to calculate these amounts here.
				 *
				 * TODO: remove the amount altogether and send only the contribution amount.
				 * but they're a legacy of how the support-workers works i.e
				 * - contribution = thisAmount - original
				 * - if contribution < 0, fail
				 * - apply any promo
				 * @see https://github.com/guardian/support-frontend/blob/51b06f33a0f9f70628154e100374d5933708e38f/support-workers/src/main/scala/com/gu/zuora/subscriptionBuilders/SupporterPlusSubcriptionBuilder.scala#L38-L42
				 */
				amount: originalAmount + (contributionAmount ?? 0),
			};
			break;

		case 'GuardianWeeklyDomestic':
			productFields = {
				productType: 'GuardianWeekly',
				currency: currencyKey,
				fulfilmentOptions: 'Domestic',
				billingPeriod: ratePlanDescription.billingPeriod,
			};
			break;

		case 'GuardianWeeklyRestOfWorld':
			productFields = {
				productType: 'GuardianWeekly',
				fulfilmentOptions: 'RestOfWorld',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
			};
			break;

		case 'DigitalSubscription':
			productFields = {
				productType: 'DigitalPack',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				readerType: 'Direct',
			};
			break;

		case 'NationalDelivery':
		case 'SubscriptionCard':
		case 'HomeDelivery':
			productFields = {
				productType: 'Paper',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				fulfilmentOptions: NoFulfilmentOptions,
				productOptions: NoProductOptions,
			};
			break;
	}

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

	const validPaymentMethods = [
		/* NOT YET IMPLEMENTED
		countryGroupId === 'EURCountries' && Sepa,
    countryId === 'US' && AmazonPay,
    */
		countryId === 'GB' && DirectDebit,
		Stripe,
		PayPal,
	]
		.filter(isPaymentMethod)
		.filter(paymentMethodIsActive);

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
	const [stripeExpressCheckoutReady, setStripeExpressCheckoutReady] =
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
	const [firstNameError, setFirstNameError] = useState<string>();
	const [lastName, setLastName] = useState(user?.lastName ?? '');
	const [lastNameError, setLastNameError] = useState<string>();
	const [email, setEmail] = useState(user?.email ?? '');
	const [emailError, setEmailError] = useState<string>();
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

	const useLinkExpressCheckout =
		abParticipations.linkExpressCheckout === 'variant';

	const formOnSubmit = async (formData: FormData) => {
		setIsProcessingPayment(true);
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
				state: formData.get('delivery-stateProvince') as string,
				postCode: formData.get('delivery-postcode') as string,
				country: formData.get('delivery-country') as IsoCountry,
			};

			const billingAddressMatchesDelivery =
				formData.get('billingAddressMatchesDelivery') === 'yes';

			billingAddress = !billingAddressMatchesDelivery
				? {
						lineOne: formData.get('billing-lineOne') as string,
						lineTwo: formData.get('billing-lineTwo') as string,
						city: formData.get('billing-city') as string,
						state: formData.get('billing-stateProvince') as string,
						postCode: formData.get('billing-postcode') as string,
						country: formData.get('billing-country') as IsoCountry,
				  }
				: deliveryAddress;
		} else {
			billingAddress = {
				state: formData.get('billing-state') as string,
				postCode: formData.get('billing-postcode') as string,
				country: formData.get('billing-country') as IsoCountry,
			};
			deliveryAddress = undefined;
		}

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
			const { client_secret: stripeClientSecret } = await fetch(
				'/stripe/create-setup-intent/prb',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						stripePublicKey,
					}),
				},
			).then(
				(response) => response.json() as Promise<{ client_secret: string }>,
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
				processPaymentResponse = await processPayment(statusResponse, geoId);
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
								<BackButton
									path={`/${geoId}/guardianlight`}
									buttonText="Back"
								/>
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
											link: useLinkExpressCheckout ? 'auto' : 'never',
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
							<div>
								<TextInput
									id="email"
									data-qm-masking="blocklist"
									label="Email address"
									value={email}
									type="email"
									autoComplete="email"
									onChange={(event) => {
										setEmail(event.currentTarget.value);
									}}
									onBlur={(event) => {
										event.target.checkValidity();
									}}
									readOnly={isSignedIn}
									name="email"
									required
									maxLength={80}
									error={emailError}
									onInvalid={(event) => {
										preventDefaultValidityMessage(event.currentTarget);
										const validityState = event.currentTarget.validity;
										if (validityState.valid) {
											setEmailError(undefined);
										} else {
											if (validityState.valueMissing) {
												setEmailError('Please enter your email address.');
											} else {
												setEmailError('Please enter a valid email address.');
											}
										}
									}}
								/>
							</div>
							<Signout isSignedIn={isSignedIn} />
							<>
								<div>
									<TextInput
										id="firstName"
										data-qm-masking="blocklist"
										label="First name"
										value={firstName}
										autoComplete="given-name"
										autoCapitalize="words"
										onChange={(event) => {
											setFirstName(event.target.value);
										}}
										onBlur={(event) => {
											event.target.checkValidity();
										}}
										name="firstName"
										required
										maxLength={40}
										error={firstNameError}
										pattern={doesNotContainEmojiPattern}
										onInvalid={(event) => {
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setFirstNameError(undefined);
											} else {
												if (validityState.valueMissing) {
													setFirstNameError('Please enter your first name.');
												} else {
													setFirstNameError('Please enter a valid first name.');
												}
											}
										}}
									/>
								</div>
								<div>
									<TextInput
										id="lastName"
										data-qm-masking="blocklist"
										label="Last name"
										value={lastName}
										autoComplete="family-name"
										autoCapitalize="words"
										onChange={(event) => {
											setLastName(event.target.value);
										}}
										onBlur={(event) => {
											event.target.checkValidity();
										}}
										name="lastName"
										required
										maxLength={40}
										error={lastNameError}
										pattern={doesNotContainEmojiPattern}
										onInvalid={(event) => {
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setLastNameError(undefined);
											} else {
												if (validityState.valueMissing) {
													setLastNameError('Please enter your last name.');
												} else {
													setLastNameError('Please enter a valid last name.');
												}
											}
										}}
									/>
								</div>
							</>

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
										pattern={doesNotContainEmojiPattern}
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

						<FormSection>
							<Legend>
								{productDescription.deliverableTo ? '3' : '2'}. Payment method
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
																// We could change the parents type to Promise and uses await here, but that has
																// a lot of refactoring with not too much gain
																onRecaptchaCompleted={(token) => {
																	setStripeClientSecretInProgress(true);
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
																		.then((json) => {
																			setStripeClientSecret(
																				(json as Record<string, string>)
																					.client_secret,
																			);
																			setStripeClientSecretInProgress(false);
																		});
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
						<SummaryTsAndCs
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
											const requestBody = {
												amount: finalAmount,
												billingPeriod: ratePlanDescription.billingPeriod,
												currency: currencyKey,
												requireShippingAddress: false,
											};
											void fetch('/paypal/setup-payment', {
												credentials: 'include',
												method: 'POST',
												headers: {
													'Content-Type': 'application/json',
													'Csrf-Token': csrf,
												},
												body: JSON.stringify(requestBody),
											})
												.then((response) => response.json())
												.then((json) => {
													resolve((json as { token: string }).token);
												})
												.catch((error) => {
													console.error(error);
													reject(error as Error);
												});
										}}
										onAuthorize={(payPalData: Record<string, unknown>) => {
											const body = {
												token: payPalData.paymentToken,
											};
											void fetch('/paypal/one-click-checkout', {
												credentials: 'include',
												method: 'POST',
												headers: {
													'Content-Type': 'application/json',
													'Csrf-Token': csrf,
												},
												body: JSON.stringify(body),
											})
												.then((response) => response.json())
												.then((json) => {
													// The state below has a useEffect that submits the form
													setPayPalBAID((json as { baid: string }).baid);
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
