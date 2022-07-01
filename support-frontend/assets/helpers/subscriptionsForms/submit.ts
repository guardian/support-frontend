// ----- Imports ----- //
import type { Dispatch } from 'redux';
import 'redux';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import type {
	PaymentAuthorisation,
	PaymentResult,
	RegularPaymentRequest,
	RegularPaymentRequestAddress,
	SubscriptionProductFields,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	postRegularPaymentRequest,
	regularPaymentFieldsFromAuthorisation,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { Quarterly } from 'helpers/productPrice/billingPeriods';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
	finalPrice,
	getCurrency,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { Direct, Gift } from 'helpers/productPrice/readerType';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	DigitalPack,
	GuardianWeekly,
	isPhysicalProduct,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { GiftingState } from 'helpers/redux/checkout/giftingState/state';
import { getSubscriptionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
	setFormSubmitted,
	setStage,
	setSubmissionError,
} from 'helpers/subscriptionsForms/formActions';
import {
	validateCheckoutForm,
	validateWithDeliveryForm,
} from 'helpers/subscriptionsForms/formValidation';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { sendEventSubscriptionCheckoutConversion } from 'helpers/tracking/quantumMetric';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { trackCheckoutSubmitAttempt } from '../tracking/behaviour';

type Addresses = {
	deliveryAddress?: RegularPaymentRequestAddress;
	billingAddress: RegularPaymentRequestAddress;
};

// ----- Functions ----- //
function getAddresses(state: SubscriptionsState): Addresses {
	const product = getSubscriptionType(state);
	if (isPhysicalProduct(product)) {
		const deliveryAddressFields =
			state.page.checkoutForm.deliveryAddress.fields;

		const billingAddressFields = state.page.checkoutForm.billingAddress.fields;

		return {
			deliveryAddress: deliveryAddressFields,
			billingAddress: state.page.checkout.billingAddressIsSame
				? deliveryAddressFields
				: billingAddressFields,
		};
	}

	return {
		billingAddress: state.page.checkoutForm.billingAddress.fields,
	};
}

const getProduct = (
	state: SubscriptionsState,
	currencyId?: Option<IsoCurrency>,
): SubscriptionProductFields => {
	const { billingPeriod, fulfilmentOption, productOption, orderIsAGift } =
		state.page.checkoutForm.product;
	const product = getSubscriptionType(state);
	const readerType = orderIsAGift ? Gift : Direct;

	if (product === DigitalPack) {
		return {
			productType: DigitalPack,
			currency: currencyId ?? state.common.internationalisation.currencyId,
			billingPeriod,
			readerType,
		};
	} else if (product === GuardianWeekly) {
		return {
			productType: GuardianWeekly,
			currency: currencyId ?? state.common.internationalisation.currencyId,
			billingPeriod,
			fulfilmentOptions: fulfilmentOption,
		};
	}

	/* Paper or PaperAndDigital */
	return {
		productType: Paper,
		currency: currencyId ?? state.common.internationalisation.currencyId,
		billingPeriod,
		fulfilmentOptions: fulfilmentOption,
		productOptions: productOption,
	};
};

const getPromoCode = (promotions?: Promotion[]) => {
	const promotion = getAppliedPromo(promotions);
	return promotion ? promotion.promoCode : null;
};

function getGiftRecipient(giftingState: GiftingState) {
	const { title, firstName, lastName, email, giftMessage, giftDeliveryDate } =
		giftingState;
	if (firstName && lastName) {
		return {
			giftRecipient: {
				title,
				firstName,
				lastName,
				email,
				message: giftMessage,
				deliveryDate: giftDeliveryDate,
			},
		};
	}
	return {};
}

function buildRegularPaymentRequest(
	state: SubscriptionsState,
	paymentAuthorisation: PaymentAuthorisation,
	addresses: Addresses,
	promotions?: Promotion[],
	currencyId?: Option<IsoCurrency>,
): RegularPaymentRequest {
	const { title, firstName, lastName, email, telephone } =
		state.page.checkoutForm.personalDetails;
	const { deliveryInstructions, csrUsername, salesforceCaseId, debugInfo } =
		state.page.checkout;
	const product = getProduct(state, currencyId);
	const paymentFields =
		regularPaymentFieldsFromAuthorisation(paymentAuthorisation);
	const recaptchaToken = state.page.checkoutForm.recaptcha.token;
	const promoCode = getPromoCode(promotions);
	const giftRecipient = getGiftRecipient(state.page.checkoutForm.gifting);
	return {
		title,
		firstName: firstName.trim(),
		lastName: lastName.trim(),
		...addresses,
		email: email.trim(),
		...giftRecipient,
		telephoneNumber: telephone,
		product,
		firstDeliveryDate: state.page.checkoutForm.product.startDate,
		paymentFields: {
			...paymentFields,
			recaptchaToken,
		},
		ophanIds: getOphanIds(),
		referrerAcquisitionData: state.common.referrerAcquisitionData,
		supportAbTests: getSupportAbTests(state.common.abParticipations),
		promoCode,
		deliveryInstructions,
		csrUsername,
		salesforceCaseId,
		debugInfo,
	};
}

function onPaymentAuthorised(
	paymentAuthorisation: PaymentAuthorisation,
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
	currencyId?: Option<IsoCurrency>,
): void {
	const {
		billingPeriod,
		fulfilmentOption,
		orderIsAGift,
		productOption,
		productPrices,
	} = state.page.checkoutForm.product;
	const productType = getSubscriptionType(state);
	const { paymentMethod } = state.page.checkout;
	const { csrf } = state.page.checkoutForm;
	const { abParticipations } = state.common;
	const addresses = getAddresses(state);
	const productPrice = getProductPrice(
		productPrices,
		addresses.billingAddress.country,
		billingPeriod,
		fulfilmentOption,
		productOption,
	);
	const data = buildRegularPaymentRequest(
		state,
		paymentAuthorisation,
		addresses,
		productPrice.promotions,
		currencyId,
	);

	const handleSubscribeResult = (result: PaymentResult) => {
		if (result.paymentStatus === 'success') {
			if (result.subscriptionCreationPending) {
				dispatch(setStage('thankyou-pending', productType, paymentMethod));
			} else {
				dispatch(setStage('thankyou', productType, paymentMethod));
			}
			// Notify Quantum Metric of successfull subscription conversion
			sendEventSubscriptionCheckoutConversion(
				productType,
				!!orderIsAGift,
				productPrice,
				billingPeriod,
			);
		} else if (result.error) {
			dispatch(setSubmissionError(result.error));
		}
	};

	dispatch(setFormSubmitted(true));
	void postRegularPaymentRequest(
		routes.subscriptionCreate,
		data,
		abParticipations,
		csrf,
	).then(handleSubscribeResult);
}

function checkStripeUserType(
	onAuthorised: (pa: PaymentAuthorisation) => void,
	stripePaymentMethodId: Option<string>,
) {
	if (stripePaymentMethodId != null) {
		onAuthorised({
			paymentMethod: Stripe,
			stripePaymentMethod: 'StripeElements',
			paymentMethodId: stripePaymentMethodId,
		});
	} else {
		throw new Error(
			'Attempting to process Stripe Payment, however Stripe Payment Method ID is missing.',
		);
	}
}

const directDebitAuthorised = (
	onAuthorised: (pa: PaymentAuthorisation) => void,
	ddState: DirectDebitState,
) => {
	onAuthorised({
		paymentMethod: DirectDebit,
		accountHolderName: ddState.accountHolderName,
		sortCode: ddState.sortCodeString,
		accountNumber: ddState.accountNumber,
	});
};

function showPaymentMethod(
	onAuthorised: (pa: PaymentAuthorisation) => void,
	paymentMethod: Option<PaymentMethod>,
	stripePaymentMethod: Option<string>,
	state: AnyCheckoutState,
): void {
	switch (paymentMethod) {
		case Stripe:
			checkStripeUserType(onAuthorised, stripePaymentMethod);
			break;

		case DirectDebit:
			directDebitAuthorised(onAuthorised, state.page.directDebit);
			break;

		case PayPal:
			// PayPal is more complicated and is handled differently, see PayPalExpressButton component
			break;

		case null:
		case undefined:
			console.log('Undefined payment method');
			break;

		default:
			console.log(`Unknown payment method ${paymentMethod}`);
	}
}

function trackSubmitAttempt(
	paymentMethod: PaymentMethod | null | undefined,
	productType: SubscriptionProduct,
	productOption: ProductOptions,
): void {
	const componentId =
		productOption === NoProductOptions
			? `subs-checkout-submit-${productType}-${paymentMethod ?? ''}`
			: `subs-checkout-submit-${productType}-${productOption}-${
					paymentMethod ?? ''
			  }`;
	trackCheckoutSubmitAttempt(
		componentId,
		productType,
		paymentMethod,
		productType,
	);
}

function getPricingCountry(product: SubscriptionProduct, addresses: Addresses) {
	if (product === GuardianWeekly && addresses.deliveryAddress) {
		return addresses.deliveryAddress.country;
	}

	return addresses.billingAddress.country;
}

function submitForm(dispatch: Dispatch<Action>, state: SubscriptionsState) {
	const { paymentMethod } = state.page.checkout;
	const { productOption, billingPeriod, fulfilmentOption, productPrices } =
		state.page.checkoutForm.product;
	const productType = getSubscriptionType(state);
	const addresses = getAddresses(state);
	const pricingCountry = getPricingCountry(productType, addresses);
	trackSubmitAttempt(paymentMethod, productType, productOption);
	let priceDetails = finalPrice(
		productPrices,
		pricingCountry,
		billingPeriod,
		fulfilmentOption,
		productOption,
	);

	// This is a small hack to make sure we show quarterly pricing until we have promos tooling
	if (billingPeriod === Quarterly && priceDetails.price === 6) {
		priceDetails = getProductPrice(
			productPrices,
			pricingCountry,
			billingPeriod,
			fulfilmentOption,
			productOption,
		);
	}

	const currencyId = getCurrency(pricingCountry);
	const stripePaymentMethod =
		paymentMethod === Stripe ? state.page.checkout.stripePaymentMethod : null;

	const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
		onPaymentAuthorised(paymentAuthorisation, dispatch, state, currencyId);

	showPaymentMethod(onAuthorised, paymentMethod, stripePaymentMethod, state);
}

function submitWithDeliveryForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): void {
	if (validateWithDeliveryForm(dispatch, state)) {
		submitForm(dispatch, state);
	}
}

function submitCheckoutForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): void {
	if (validateCheckoutForm(dispatch, state)) {
		submitForm(dispatch, state);
	}
}

// ----- Export ----- //
export {
	onPaymentAuthorised,
	showPaymentMethod,
	submitCheckoutForm,
	submitWithDeliveryForm,
	trackSubmitAttempt,
};
