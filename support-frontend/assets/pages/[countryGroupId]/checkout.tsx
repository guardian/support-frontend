import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import {
	Button,
	Checkbox,
	Column,
	Columns,
	Container,
	Label,
	Radio,
	RadioGroup,
	TextInput,
	textInputThemeDefault,
} from '@guardian/source/react-components';
import {
	Divider,
	ErrorSummary,
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import {
	CardNumberElement,
	Elements,
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	getTermsConditions,
	getTermsStartDateTier3,
} from 'components/orderSummary/contributionsOrderSummaryContainer';
import { PageScaffold } from 'components/page/pageScaffold';
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
	RegularPaymentRequest,
	StatusResponse,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	AmazonPay,
	DirectDebit,
	isPaymentMethod,
	type PaymentMethod as LegacyPaymentMethod,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import { getStripeKey } from 'helpers/forms/stripe';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { ProductKey } from 'helpers/productCatalog';
import {
	filterBenefitByRegion,
	isProductKey,
	productCatalog,
	productCatalogDescription,
} from 'helpers/productCatalog';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { useAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import * as cookie from 'helpers/storage/cookie';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { PaymentTsAndCs } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import {
	formatMachineDate,
	formatUserDate,
} from '../../helpers/utilities/dateConversions';
import { getTierThreeDeliveryDate } from '../weekly-subscription-checkout/helpers/deliveryDays';
import { setThankYouOrder, unsetThankYouOrder } from './thank-you';

/**
 * We have not added StripeExpressCheckoutElement to the old PaymentMethod
 * as it is heavily coupled through the code base and would require adding
 * a lot of extra unused code to those coupled areas.
 */
type PaymentMethod = LegacyPaymentMethod | 'StripeExpressCheckoutElement';
const countryId: IsoCountry = CountryHelper.detect();

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

	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const fieldset = css`
	position: relative;

	& > *:not(:first-of-type) {
		margin-top: ${space[3]}px;
	}

	${from.tablet} {
		& > *:not(:first-of-type) {
			margin-top: ${space[4]}px;
		}
	}
`;

const paymentMethodSelected = css`
	box-shadow: inset 0 0 0 2px ${textInputThemeDefault.textInput.borderActive};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const paymentMethodNotSelected = css`
	/* Using box shadows prevents layout shift when the rows are expanded */
	box-shadow: inset 0 0 0 1px ${textInputThemeDefault.textInput.border};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const paymentMethodBody = css`
	padding: ${space[5]}px ${space[3]}px ${space[6]}px;
`;

const paymentMethodRadioWithImage = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: ${space[2]}px ${space[3]}px;
	font-weight: bold;
`;
const paymentMethodRadioWithImageSelected = css`
	background-image: linear-gradient(
		to top,
		${palette.brand[500]} 2px,
		transparent 2px
	);
`;

const defaultRadioLabelColour = css`
	+ label div {
		color: ${neutral[46]};
		font-weight: bold;
	}
`;

const checkedRadioLabelColour = css`
	+ label div {
		color: ${brand[400]};
		font-weight: bold;
	}
`;

/**
 * This method removes the `pending` state by retrying,
 * resolving on success or failure only.
 */
const processPayment = async (
	statusResponse: StatusResponse,
	geoId: GeoId,
): Promise<
	{ status: 'success' } | { status: 'failure'; failureReason?: ErrorReason }
> => {
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

/** Form Validation */
/**
 * This uses a Unicode character class escape
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape
 */
const doesNotContainEmojiPattern = '^[^\\p{Emoji_Presentation}]+$';
function preventDefaultValidityMessage(
	currentTarget: HTMLInputElement | HTMLSelectElement,
) {
	/**
	 * Prevents default message showing, but maintains the default validation methods occuring
	 * such as onInvalid.
	 */
	// 3. Reset the value from previous invalid events
	currentTarget.setCustomValidity('');
	// 1. Check the validity of the input
	if (!currentTarget.validity.valid) {
		// 2. setCustomValidity to " " which avoids the browser's default message
		currentTarget.setCustomValidity(' ');
	}
}

type ChangeButtonProps = {
	geoId: GeoId;
};

function ChangeButton({ geoId }: ChangeButtonProps) {
	return (
		<a href={`/${geoId}/contribute`}>
			<Button priority="tertiary" size="xsmall" role="link">
				Change
			</Button>
		</a>
	);
}

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};
export function Checkout({ geoId, appConfig }: Props) {
	const { currencyKey } = getGeoIdConfig(geoId);
	const searchParams = new URLSearchParams(window.location.search);

	/** Get and validate product */
	const productParam = searchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	if (!product) {
		return <div>Product not found</div>;
	}

	/**
	 * Get and validate ratePlan
	 * TODO: This type should be more specific e.g. `ProductRatePlanKey<P>`.
	 * Annoyingly the TypeScript for this is a little fiddly due to the
	 * API being completely based on literals, so we've left it as `string`
	 * although we do validate it is a valid ratePlan for this product
	 */
	const ratePlanParam = searchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && ratePlanParam in product.ratePlans
			? ratePlanParam
			: undefined;
	const ratePlan = ratePlanKey && product.ratePlans[ratePlanKey];
	if (!ratePlan) {
		return <div>Rate plan not found</div>;
	}

	/** Get and validate price */
	let price: number | undefined;
	if (productKey === 'Contribution') {
		const priceParam = searchParams.get('price');
		price = priceParam ? parseInt(priceParam, 10) : undefined;
	} else {
		price =
			currencyKey in ratePlan.pricing
				? ratePlan.pricing[currencyKey]
				: undefined;
	}
	if (!price) {
		return <div>Price not found</div>;
	}

	/**
	 * TODO: We should probaly send this down from the server as
	 * this cookie is not always an accurate indicator as to
	 * whether an account is still valid
	 */
	const isTestUser = !!cookie.get('_test_username');
	const stripePublicKey = getStripeKey(
		// TODO - ONE_OFF support - This will need to be ONE_OFF when we support it
		'REGULAR',
		countryId,
		currencyKey,
		isTestUser,
	);
	const stripePromise = loadStripe(stripePublicKey);

	const stripeExpressCheckoutSwitch =
		window.guardian.settings.switches.recurringPaymentMethods
			.stripeExpressCheckout === 'On';

	let elementsOptions = {};
	let useStripeExpressCheckout = false;
	if (stripeExpressCheckoutSwitch) {
		/**
		 * Currently we're only using the stripe ExpressCheckoutElement on Contribution purchases
		 * which then needs this configuration.
		 */
		const urlSearchParams = new URLSearchParams(window.location.search);
		const price = urlSearchParams.get('price');
		const priceInt = price ? parseInt(price, 10) : undefined;
		if (urlSearchParams.get('product') === 'Contribution' && priceInt) {
			elementsOptions = {
				mode: 'payment',
				/**
				 * Stripe amounts are in the "smallest currency unit"
				 * @see https://docs.stripe.com/api/charges/object
				 * @see https://docs.stripe.com/currencies#zero-decimal
				 */
				amount: priceInt * 100,
				currency: currencyKey.toLowerCase(),
				paymentMethodCreation: 'manual',
			} as const;
			useStripeExpressCheckout = true;
		}
	}

	return (
		<Elements stripe={stripePromise} options={elementsOptions}>
			<CheckoutComponent
				geoId={geoId}
				appConfig={appConfig}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				price={price}
				useStripeExpressCheckout={useStripeExpressCheckout}
			/>
		</Elements>
	);
}

type CheckoutComponentProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	productKey: ProductKey;
	ratePlanKey: string;
	price: number;
	useStripeExpressCheckout: boolean;
};
function CheckoutComponent({
	geoId,
	appConfig,
	productKey,
	ratePlanKey,
	price: priceOriginal,
	useStripeExpressCheckout,
}: CheckoutComponentProps) {
	/** we unset any previous orders that have been made */
	unsetThankYouOrder();

	const csrf = appConfig.csrf.token;
	const user = appConfig.user;
	const isSignedIn = !!user?.email;
	const isTestUser = !!cookie.get('_test_username');
	const productPrices = window.guardian.productPrices;

	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const fulfilmentOption =
		countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic';

	const productDescription = productCatalogDescription[productKey];
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey];

	const promotion = getPromotion(
		productPrices,
		countryId,
		ratePlanDescription.billingPeriod,
		fulfilmentOption,
	);
	const price = promotion?.discountedPrice
		? promotion.discountedPrice
		: priceOriginal;

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
		case 'TierThree':
			productFields = {
				productType: 'TierThree',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				fulfilmentOptions:
					ratePlanKey === 'DomesticMonthly' || ratePlanKey === 'DomesticAnnual'
						? 'Domestic'
						: ratePlanKey === 'RestOfWorldMonthly' ||
						  ratePlanKey === 'RestOfWorldAnnual'
						? 'RestOfWorld'
						: 'Domestic',
			};
			break;

		case 'Contribution':
			productFields = {
				productType: 'Contribution',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				amount: price,
			};
			break;

		case 'SupporterPlus':
			productFields = {
				productType: 'SupporterPlus',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				amount: price,
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
		if (priceOriginal < 1) {
			isInvalidAmount = true;
		}
		if (!isContributionsOnlyCountry(selectedAmountsVariant)) {
			if (priceOriginal >= supporterPlusRatePlanPrice) {
				isInvalidAmount = true;
			}
		}
	}

	if (isInvalidAmount) {
		return <div>Invalid Amount {priceOriginal}</div>;
	}

	const validPaymentMethods = [
		countryGroupId === 'EURCountries' && Sepa,
		countryId === 'GB' && DirectDebit,
		// TODO - ONE_OFF support - ☝️ these will be inactivated for ONE_OFF payments
		Stripe,
		PayPal,
		countryId === 'US' && AmazonPay,
	].filter(isPaymentMethod);

	// TODO - ONE_OFF support, this should be false when ONE_OFF
	const showStateSelect =
		countryId === 'US' || countryId === 'CA' || countryId === 'AU';

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

	/** Payment methods: Stripe */
	const stripePublicKey = getStripeKey(
		// TODO - ONE_OFF support - This will need to be ONE_OFF when we support it
		'REGULAR',
		countryId,
		currencyKey,
		isTestUser,
	);
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

	const abParticipations = abTestInit({ countryId, countryGroupId });
	const supportAbTests = getSupportAbTests(abParticipations);

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

		/** FormData: `paymentFields` */
		let paymentFields;
		if (
			paymentMethod === 'Stripe' &&
			stripe &&
			cardElement &&
			stripeClientSecret
		) {
			// TODO - ONE_OFF support - we'll need to implement the ONE_OFF stripe payment.
			// You can find this in file://./../../components/stripeCardForm/stripePaymentButton.tsx#oneOffPayment
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
					stripePublicKey,
					recaptchaToken: recaptchaToken,
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
				paymentMethod: setupIntent.payment_method as string,
				stripePaymentType,
				stripePublicKey,
			};
		}

		if (paymentMethod === 'PayPal') {
			paymentFields = {
				recaptchaToken: '',
				paymentMethod: 'PayPal',
				baid: formData.get('payPalBAID') as string,
			};
		}

		if (paymentMethod === 'DirectDebit' && recaptchaToken !== undefined) {
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

		if (paymentMethod && paymentFields) {
			/** TODO
			 * - add debugInfo
			 */
			const firstDeliveryDate =
				productKey === 'TierThree'
					? formatMachineDate(getTierThreeDeliveryDate())
					: null;
			const promoCode = promotion?.promoCode;

			const createSupportWorkersRequest: RegularPaymentRequest = {
				...personalData,
				billingAddress,
				deliveryAddress,
				firstDeliveryDate,
				paymentFields,
				promoCode,
				ophanIds,
				referrerAcquisitionData,
				product: productFields,
				supportAbTests,
				debugInfo: '',
			};
			setErrorMessage(undefined);
			setErrorContext(undefined);
			const createSubscriptionResult = await fetch('/subscribe/create', {
				method: 'POST',
				body: JSON.stringify(createSupportWorkersRequest),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((json) => json as StatusResponse);

			const processPaymentResponse = await processPayment(
				createSubscriptionResult,
				geoId,
			);
			if (processPaymentResponse.status === 'success') {
				const order = {
					firstName: personalData.firstName,
					price: price,
					product: productKey,
					ratePlan: ratePlanKey,
					paymentMethod: paymentMethod,
				};
				setThankYouOrder(order);
				window.location.href = `/${geoId}/thank-you?product=${productKey}&ratePlan=${ratePlanKey}&promoCode=${promoCode}`;
			} else {
				// TODO - error handling
				console.error(
					'processPaymentResponse error:',
					processPaymentResponse.failureReason,
				);
			}
		} else {
			setIsProcessingPayment(false);
		}
	};

	const { supportInternationalisationId } = countryGroups[countryGroupId];

	useAbandonedBasketCookie(
		productKey,
		price,
		ratePlanDescription.billingPeriod,
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
	);

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
					<Column span={[0, 2, 2, 3, 4]}></Column>
					<Column span={[1, 8, 8, 8, 8]}>
						<SecureTransactionIndicator
							align="center"
							theme="light"
							cssOverrides={secureTransactionIndicator}
						/>
						<Box cssOverrides={shorterBoxMargin}>
							<BoxContents>
								<ContributionsOrderSummary
									description={productDescription.label}
									paymentFrequency={
										ratePlanDescription.billingPeriod === 'Annual'
											? 'year'
											: ratePlanDescription.billingPeriod === 'Monthly'
											? 'month'
											: 'quarter'
									}
									amount={priceOriginal}
									promotion={promotion}
									currency={currency}
									checkListData={[
										...productDescription.benefits
											.filter((benefit) =>
												filterBenefitByRegion(benefit, countryGroupId),
											)
											.map((benefit) => ({
												isChecked: true,
												text: benefit.copy,
											})),
										...(productDescription.benefitsAdditional ?? [])
											.filter((benefit) =>
												filterBenefitByRegion(benefit, countryGroupId),
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
											`contribution-order-summary-${
												isOpen ? 'opened' : 'closed'
											}`,
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
									headerButton={<ChangeButton geoId={geoId} />}
								/>
							</BoxContents>
						</Box>
						<form
							ref={formRef}
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
									{useStripeExpressCheckout && (
										<>
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
													const options = {
														emailRequired: true,
													};
													resolve(options);
												}}
												onConfirm={async (event) => {
													if (!(stripe && elements)) {
														console.error('Stripe not loaded');
														return;
													}

													const { error: submitError } =
														await elements.submit();

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
										</>
									)}
									<fieldset css={fieldset}>
										<legend css={legend}>1. Your details</legend>
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
															setEmailError(
																'Please enter a valid email address.',
															);
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
																setFirstNameError(
																	'Please enter your first name.',
																);
															} else {
																setFirstNameError(
																	'Please enter a valid first name.',
																);
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
																setLastNameError(
																	'Please enter your last name.',
																);
															} else {
																setLastNameError(
																	'Please enter a valid last name.',
																);
															}
														}
													}}
												/>
											</div>
										</>
										{/*For deliverable products we take the state and
                    zip code with the delivery address*/}
										{showStateSelect && !productDescription.deliverableTo && (
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

										{countryId === 'US' &&
											!productDescription.deliverableTo && (
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
														onInvalid={(event) => {
															preventDefaultValidityMessage(
																event.currentTarget,
															);
															const validityState =
																event.currentTarget.validity;
															if (validityState.valid) {
																setBillingPostcodeError(undefined);
															} else {
																if (!validityState.valueMissing) {
																	setBillingPostcodeError(
																		'Please enter a valid zip code.',
																	);
																}
															}
														}}
													/>
												</div>
											)}
									</fieldset>

									<CheckoutDivider spacing="loose" />

									{/**
									 * We need the billing-country for all transactions, even non-deliverable ones
									 * which we get from the GU_country cookie which comes from the Fastly geo client.
									 */}
									{!productDescription.deliverableTo && (
										<input
											type="hidden"
											name="billing-country"
											value={countryId}
										/>
									)}
									{productDescription.deliverableTo && (
										<>
											<fieldset>
												<legend css={legend}>2. Delivery address</legend>
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
												</fieldset>
											)}

											<CheckoutDivider spacing="loose" />
										</>
									)}

									<fieldset css={fieldset}>
										<legend css={legend}>
											{productDescription.deliverableTo ? '3' : '2'}. Payment
											method
											<SecureTransactionIndicator
												hideText={true}
												cssOverrides={css``}
											/>
										</legend>

										<RadioGroup>
											{validPaymentMethods.map((validPaymentMethod) => {
												const selected = paymentMethod === validPaymentMethod;
												const { label, icon } =
													paymentMethodData[validPaymentMethod];
												return (
													<div
														css={
															selected
																? paymentMethodSelected
																: paymentMethodNotSelected
														}
													>
														<div
															css={[
																paymentMethodRadioWithImage,
																selected
																	? paymentMethodRadioWithImageSelected
																	: undefined,
															]}
														>
															<Radio
																label={label}
																name="paymentMethod"
																value={validPaymentMethod}
																css={
																	selected
																		? checkedRadioLabelColour
																		: defaultRadioLabelColour
																}
																onChange={() => {
																	setPaymentMethod(validPaymentMethod);
																}}
															/>
															<div>{icon}</div>
														</div>
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
																							'Content-Type':
																								'application/json',
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
																						setStripeClientSecretInProgress(
																							false,
																						);
																					});
																			}}
																			onRecaptchaExpired={() => {
																				// no-op
																			}}
																		/>
																	}
																/>
															</div>
														)}

														{validPaymentMethod === 'DirectDebit' &&
															selected && (
																<div
																	css={css`
																		padding: ${space[5]}px ${space[3]}px
																			${space[6]}px;
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
																			setAccountHolderConfirmation(
																				confirmation,
																			);
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
																</div>
															)}
													</div>
												);
											})}
										</RadioGroup>
									</fieldset>
									<div
										css={css`
											margin-top: ${space[8]}px;
											margin-bottom: ${space[8]}px;
										`}
									>
										{paymentMethod !== 'PayPal' && (
											<DefaultPaymentButton
												isLoading={stripeClientSecretInProgress}
												buttonText={
													stripeClientSecretInProgress
														? 'Validating reCAPTCHA...'
														: `Pay ${simpleFormatAmount(currency, price)} per ${
																ratePlanDescription.billingPeriod === 'Annual'
																	? 'year'
																	: ratePlanDescription.billingPeriod ===
																	  'Monthly'
																	? 'month'
																	: 'quarter'
														  }`
												}
												onClick={() => {
													// no-op
													// This isn't needed because we are now using the form onSubmit handler
												}}
												type="submit"
												disabled={stripeClientSecretInProgress}
											/>
										)}
										{payPalLoaded && paymentMethod === 'PayPal' && (
											<>
												<input
													type="hidden"
													name="payPalBAID"
													value={payPalBAID}
												/>

												<PayPalButton
													env={isTestUser ? 'sandbox' : 'production'}
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
														formRef.current?.addEventListener(
															'change',
															(event) => {
																const valid =
																	// TODO - we shouldn't have to type infer here
																	(
																		event.currentTarget as HTMLFormElement
																	).checkValidity();
																if (valid) {
																	enable();
																} else {
																	disable();
																}
															},
														);
													}}
													funding={{
														disallowed: [window.paypal.FUNDING.CREDIT],
													}}
													onClick={() => {
														// TODO
													}}
													/** the order is Button.payment(opens PayPal window).then(Button.onAuthorize) */
													payment={(resolve, reject) => {
														const requestBody = {
															amount: price,
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
													onAuthorize={(
														payPalData: Record<string, unknown>,
													) => {
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
										amount={price}
										amountIsAboveThreshold={
											productDescription.label === 'All-access digital' ||
											productDescription.label === 'Digital + print'
										}
										productNameAboveThreshold={productDescription.label}
										promotion={promotion}
									/>
								</BoxContents>
							</Box>
						</form>
						<CheckoutDivider spacing="loose" mobileTheme={'light'} />
						<PatronsMessage
							countryGroupId={countryGroupId}
							mobileTheme={'light'}
						/>
						<GuardianTsAndCs
							mobileTheme={'light'}
							displayPatronsCheckout={false}
						/>
					</Column>
				</Columns>
			</Container>
			{isProcessingPayment && (
				<LoadingOverlay>
					<p>Processing transaction</p>
					<p>Please wait</p>
				</LoadingOverlay>
			)}
		</PageScaffold>
	);
}
