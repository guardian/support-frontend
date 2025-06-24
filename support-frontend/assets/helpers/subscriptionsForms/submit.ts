import type { SupportInternationalisationId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import {
	HomeDelivery,
	NationalDelivery,
} from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import type { PaymentMethod as StripePaymentMethod } from '@stripe/stripe-js';
import type { Dispatch } from 'redux';
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
import {
	getCurrency,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { finalPrice, getAppliedPromo } from 'helpers/productPrice/promotions';
import { Direct, Gift } from 'helpers/productPrice/readerType';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	DigitalPack,
	GuardianWeekly,
	isPhysicalProduct,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { GiftingState } from 'helpers/redux/checkout/giftingState/state';
import type { DirectDebitState } from 'helpers/redux/checkout/payment/directDebit/state';
import { getSubscriptionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
	setFormSubmitted,
	setStage,
	setSubmissionError,
} from 'helpers/subscriptionsForms/formActions';
import { validateWithDeliveryForm } from 'helpers/subscriptionsForms/formValidation';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { successfulSubscriptionConversion } from 'helpers/tracking/googleTagManager';
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
			billingAddress: state.page.checkoutForm.addressMeta
				.billingAddressMatchesDelivery
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
	deliveryAgent?: number,
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
		fulfilmentOptions: getPaperFulfilmentOption(fulfilmentOption, state),
		productOptions: productOption,
		deliveryAgent,
	};
};

const getPaperFulfilmentOption = (
	fulfilmentOption: FulfilmentOptions,
	state: SubscriptionsState,
) => {
	return fulfilmentOption === HomeDelivery &&
		state.page.checkoutForm.addressMeta.deliveryAgent.chosenAgent
		? NationalDelivery
		: fulfilmentOption;
};

const getAppliedPromotion = (
	supportInternationalisationId: SupportInternationalisationId,
	promotions?: Promotion[],
) => {
	const promotion = getAppliedPromo(promotions);
	return promotion?.promoCode !== undefined
		? {
				promoCode: promotion.promoCode,
				countryGroupId: supportInternationalisationId,
		  }
		: undefined;
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

function getPrintDiscountedPrice(
	productPrice: ProductPrice,
	promoCode?: Option<string>,
): number {
	const defaultPrice = productPrice.price;
	if (productPrice.promotions && productPrice.promotions.length > 0) {
		const validPromo = productPrice.promotions.find(
			(promotion) => promotion.promoCode === promoCode,
		);
		if (validPromo) {
			return validPromo.discountedPrice ?? defaultPrice;
		}
	}
	return defaultPrice;
}

function buildRegularPaymentRequest(
	state: SubscriptionsState,
	paymentAuthorisation: PaymentAuthorisation,
	addresses: Addresses,
	promotions?: Promotion[],
	currencyId?: Option<IsoCurrency>,
): RegularPaymentRequest {
	const { actionHistory } = state.debug;
	const { title, firstName, lastName, email, telephone } =
		state.page.checkoutForm.personalDetails;
	const {
		deliveryInstructions,
		deliveryAgent: { chosenAgent: chosenDeliveryAgent },
	} = state.page.checkoutForm.addressMeta;
	const { csrUsername, salesforceCaseId } = state.page.checkout;
	const product = getProduct(state, currencyId, chosenDeliveryAgent);
	const recaptchaToken = state.page.checkoutForm.recaptcha.token;
	const paymentFields = regularPaymentFieldsFromAuthorisation(
		paymentAuthorisation,
		state.page.checkoutForm.payment.stripeAccountDetails.publicKey,
		recaptchaToken,
	);
	const giftRecipient = getGiftRecipient(state.page.checkoutForm.gifting);
	const appliedPromotion = getAppliedPromotion(
		countryGroups[state.common.internationalisation.countryGroupId]
			.supportInternationalisationId,
		promotions,
	);

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
		paymentFields,
		ophanIds: getOphanIds(),
		referrerAcquisitionData: state.common.referrerAcquisitionData,
		supportAbTests: getSupportAbTests(state.common.abParticipations),
		appliedPromotion,
		deliveryInstructions,
		csrUsername,
		salesforceCaseId,
		debugInfo: actionHistory,
	};
}

function onPaymentAuthorised(
	paymentAuthorisation: PaymentAuthorisation,
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
	currency?: IsoCurrency,
): void {
	const {
		billingPeriod,
		fulfilmentOption,
		orderIsAGift,
		productOption,
		productPrices,
	} = state.page.checkoutForm.product;
	const productType = getSubscriptionType(state);
	const { paymentMethod } = state.page.checkoutForm.payment;
	const { csrf } = state.page.checkoutForm;
	const addresses = getAddresses(state);
	const pricingCountry =
		addresses.deliveryAddress?.country ?? addresses.billingAddress.country;
	const productPrice = getProductPrice(
		productPrices,
		pricingCountry,
		billingPeriod,
		fulfilmentOption,
		productOption,
	);
	const data = buildRegularPaymentRequest(
		state,
		paymentAuthorisation,
		addresses,
		productPrice.promotions,
		currency,
	);

	const handleSubscribeResult = (result: PaymentResult) => {
		if (result.paymentStatus === 'success') {
			if (result.subscriptionCreationPending) {
				dispatch(setStage('thankyou-pending', productType, paymentMethod.name));
			} else {
				dispatch(setStage('thankyou', productType, paymentMethod.name));
			}

			const printPriceDiscounted = getPrintDiscountedPrice(
				productPrice,
				data.appliedPromotion?.promoCode,
			);
			const { currencyId } = state.common.internationalisation;

			// GTM: track print subscription conversion
			successfulSubscriptionConversion(
				printPriceDiscounted,
				currencyId,
				paymentMethod.name,
				billingPeriod,
				productType,
			);

			// QM: track print subscription conversion
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
	void postRegularPaymentRequest(routes.subscriptionCreate, data, csrf).then(
		handleSubscribeResult,
	);
}

function checkStripeUserType(
	onAuthorised: (pa: PaymentAuthorisation) => void,
	stripePaymentMethodId?: string | StripePaymentMethod,
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
		sortCode: ddState.sortCode,
		accountNumber: ddState.accountNumber,
	});
};

function showPaymentMethod(
	onAuthorised: (pa: PaymentAuthorisation) => void,
	paymentMethod: Option<PaymentMethod>,
	stripePaymentMethod: string | StripePaymentMethod | undefined,
	state: AnyCheckoutState,
): void {
	switch (paymentMethod) {
		case Stripe:
			checkStripeUserType(onAuthorised, stripePaymentMethod);
			break;

		case DirectDebit:
			directDebitAuthorised(
				onAuthorised,
				state.page.checkoutForm.payment.directDebit,
			);
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
	trackCheckoutSubmitAttempt(componentId, productType);
}

function getPricingCountry(product: SubscriptionProduct, addresses: Addresses) {
	if (product === GuardianWeekly && addresses.deliveryAddress) {
		return addresses.deliveryAddress.country;
	}

	return addresses.billingAddress.country;
}

function submitForm(dispatch: Dispatch<Action>, state: SubscriptionsState) {
	const { paymentMethod } = state.page.checkoutForm.payment;
	const { productOption, billingPeriod, fulfilmentOption, productPrices } =
		state.page.checkoutForm.product;
	const productType = getSubscriptionType(state);
	const addresses = getAddresses(state);
	const pricingCountry = getPricingCountry(productType, addresses);
	trackSubmitAttempt(paymentMethod.name, productType, productOption);
	let priceDetails = finalPrice(
		productPrices,
		pricingCountry,
		billingPeriod,
		fulfilmentOption,
		productOption,
	);

	// This is a small hack to make sure we show quarterly pricing until we have promos tooling
	if (billingPeriod === BillingPeriod.Quarterly && priceDetails.price === 6) {
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
		state.page.checkoutForm.payment.stripe.stripePaymentMethod;

	const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
		onPaymentAuthorised(paymentAuthorisation, dispatch, state, currencyId);

	showPaymentMethod(
		onAuthorised,
		paymentMethod.name,
		stripePaymentMethod,
		state,
	);
}

function submitWithDeliveryForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): void {
	if (validateWithDeliveryForm(dispatch, state)) {
		submitForm(dispatch, state);
	}
}

// ----- Export ----- //
export { onPaymentAuthorised, submitWithDeliveryForm, trackSubmitAttempt };
