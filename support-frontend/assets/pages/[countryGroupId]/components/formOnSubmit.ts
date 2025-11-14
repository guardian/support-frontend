import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import type { Promotion } from 'helpers/productPrice/promotions';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import type { Participations } from '../../../helpers/abTests/models';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import type {
	AppliedPromotion,
	ProductFields,
	RegularPaymentFields,
	RegularPaymentRequest,
} from '../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from '../../../helpers/productCatalog';
import type { UserType } from '../../../helpers/redux/checkout/personalDetails/state';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from '../../../helpers/tracking/acquisitions';
import { getProductFirstDeliveryDate } from '../checkout/helpers/deliveryDays';
import type { FormPersonalFields } from '../checkout/helpers/formDataExtractors';
import {
	extractDeliverableAddressDataFromForm,
	extractGiftRecipientDataFromForm,
	extractNonDeliverableAddressDataFromForm,
	extractPersonalDataFromForm,
} from '../checkout/helpers/formDataExtractors';
import { buildProductInformation } from '../checkout/helpers/productInformation';
import { setThankYouOrder } from '../checkout/helpers/sessionStorage';
import { stripeCreateCheckoutSession } from '../checkout/helpers/stripe';
import {
	deleteFormDetails,
	persistFormDetails,
} from '../checkout/helpers/stripeCheckoutSession';
import getConsentValue from '../helpers/getConsentValue';
import { createSubscription } from './createSubscription';
import type { PaymentMethod } from './paymentFields';
import { FormSubmissionError } from './paymentFields';
import { CONSENT_ID } from './SimilarProductsConsent';

export const submitForm = async ({
	supportRegionId,
	productKey,
	ratePlanKey,
	formData,
	paymentMethod,
	paymentFields,
	productFields,
	hasDeliveryAddress,
	abParticipations,
	promotion,
	contributionAmount,
	deliveryDate,
}: {
	supportRegionId: SupportRegionId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	formData: FormData;
	paymentMethod: PaymentMethod;
	paymentFields: RegularPaymentFields;
	productFields: ProductFields;
	hasDeliveryAddress: boolean;
	abParticipations: Participations;
	promotion: Promotion | undefined;
	contributionAmount: number | undefined;
	deliveryDate?: Date;
}): Promise<string> => {
	const personalData = extractPersonalDataFromForm(formData);
	const giftRecipient = extractGiftRecipientDataFromForm(formData);
	const { billingAddress, deliveryAddress } = hasDeliveryAddress
		? extractDeliverableAddressDataFromForm(formData)
		: extractNonDeliverableAddressDataFromForm(formData);

	const ophanIds = getOphanIds();
	const referrerAcquisitionData = {
		...getReferrerAcquisitionData(),
		labels: ['generic-checkout'], // Shall we get rid of this now?
	};

	const firstDelivery = getProductFirstDeliveryDate(
		productKey,
		ratePlanKey as ActivePaperProductOptions,
	);
	const firstDeliveryDate = firstDelivery
		? formatMachineDate(firstDelivery)
		: null;

	const promoCode = promotion?.promoCode;
	const appliedPromotion =
		promoCode !== undefined
			? {
					promoCode,
					supportRegionId: supportRegionId,
			  }
			: undefined;
	const supportAbTests = getSupportAbTests(abParticipations);
	const deliveryInstructions = formData.get('deliveryInstructions') as string;
	const similarProductsConsent = getConsentValue(formData, CONSENT_ID);
	let redactedAccountNumber = '';
	if (paymentFields.paymentType === 'DirectDebit') {
		redactedAccountNumber = `******${paymentFields.accountNumber.slice(-2)}`;
	}

	const productInformation = buildProductInformation({
		productFields: productFields,
		productKey: productKey,
		ratePlanKey: ratePlanKey,
		personalData: personalData,
		deliveryAddress: deliveryAddress,
		firstDeliveryDate: firstDeliveryDate ?? undefined,
		deliveryInstructions: deliveryInstructions,
		giftRecipient: giftRecipient,
	});

	const paymentRequest: RegularPaymentRequest = {
		...personalData,
		billingAddress,
		deliveryAddress,
		firstDeliveryDate,
		paymentFields,
		appliedPromotion,
		ophanIds,
		referrerAcquisitionData,
		product: productFields,
		productInformation,
		supportAbTests,
		deliveryInstructions,
		debugInfo: '',
		similarProductsConsent,
		giftRecipient,
	};

	if (
		paymentFields.paymentType === 'StripeHostedCheckout' &&
		!paymentFields.checkoutSessionId
	) {
		const checkoutSession = await createStripeCheckoutSession({
			personalData,
			appliedPromotion,
			productKey,
			ratePlanKey,
			contributionAmount,
			paymentMethod,
			supportRegionId,
			paymentRequest,
		});

		persistFormDetails(checkoutSession.id, {
			personalData,
			addressFields: {
				billingAddress,
				deliveryAddress,
			},
			deliveryInstructions,
		});

		return checkoutSession.url;
	} else {
		const thankYouUrl = await processSubscription({
			personalData,
			appliedPromotion,
			productKey,
			ratePlanKey,
			contributionAmount,
			paymentMethod,
			supportRegionId,
			paymentRequest,
			deliveryDate,
			accountNumber: redactedAccountNumber,
		});

		// If Stripe hosted checkout, delete previously persisted form details
		if (paymentFields.paymentType === 'StripeHostedCheckout') {
			deleteFormDetails();
		}

		return thankYouUrl;
	}
};

const createStripeCheckoutSession = async ({
	paymentRequest,
}: {
	personalData: FormPersonalFields;
	appliedPromotion?: AppliedPromotion;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	contributionAmount: number | undefined;
	paymentMethod: PaymentMethod;
	supportRegionId: SupportRegionId;
	paymentRequest: RegularPaymentRequest;
}) => {
	const createCheckoutSessionResult = await stripeCreateCheckoutSession(
		paymentRequest,
	);
	return createCheckoutSessionResult;
};

const processSubscription = async ({
	personalData,
	appliedPromotion,
	productKey,
	ratePlanKey,
	contributionAmount,
	paymentMethod,
	supportRegionId,
	paymentRequest,
	deliveryDate,
	accountNumber,
}: {
	personalData: FormPersonalFields;
	appliedPromotion?: AppliedPromotion;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	contributionAmount: number | undefined;
	paymentMethod: PaymentMethod;
	supportRegionId: SupportRegionId;
	paymentRequest: RegularPaymentRequest;
	deliveryDate?: Date;
	accountNumber?: string;
}) => {
	const createSubscriptionResult = await createSubscription(paymentRequest);

	if (
		createSubscriptionResult.status === 'success' ||
		createSubscriptionResult.status === 'pending'
	) {
		return buildThankYouPageUrl(
			productKey,
			ratePlanKey,
			appliedPromotion?.promoCode,
			createSubscriptionResult.userType,
			contributionAmount,
			personalData,
			paymentMethod,
			createSubscriptionResult.status,
			supportRegionId,
			deliveryDate,
			accountNumber,
		);
	} else {
		console.error(
			'processPaymentResponse error:',
			createSubscriptionResult.failureReason,
		);
		throw new FormSubmissionError(
			'Sorry, something went wrong.',
			appropriateErrorMessage(
				createSubscriptionResult.failureReason ?? 'unknown',
			),
		);
	}
};

const buildThankYouPageUrl = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode: string | undefined,
	userType: UserType | undefined,
	contributionAmount: number | undefined,
	personalData: FormPersonalFields,
	paymentMethod: PaymentMethod,
	status: 'success' | 'pending',
	supportRegionId: SupportRegionId,
	deliveryDate?: Date,
	accountNumber?: string,
) => {
	const order = {
		firstName: personalData.firstName,
		email: personalData.email,
		paymentMethod: paymentMethod,
		status: status,
		deliveryDate: deliveryDate,
		accountNumber,
	};
	setThankYouOrder(order);
	const thankYouUrlSearchParams = new URLSearchParams();
	thankYouUrlSearchParams.set('product', productKey);
	thankYouUrlSearchParams.set('ratePlan', ratePlanKey);
	promoCode && thankYouUrlSearchParams.set('promoCode', promoCode);
	userType && thankYouUrlSearchParams.set('userType', userType);
	contributionAmount &&
		thankYouUrlSearchParams.set('contribution', contributionAmount.toString());
	return `/${supportRegionId}/thank-you?${thankYouUrlSearchParams.toString()}`;
};
