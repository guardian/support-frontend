import type { ProductPurchase } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import { productPurchaseSchema } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import type { Participations } from '../../../helpers/abTests/models';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import type {
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
import { getFirstDeliveryDateForProduct } from '../checkout/helpers/deliveryDates';
import type { FormPersonalFields } from '../checkout/helpers/formDataExtractors';
import {
	extractDeliverableAddressDataFromForm,
	extractNonDeliverableAddressDataFromForm,
	extractPersonalDataFromForm,
} from '../checkout/helpers/formDataExtractors';
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
	geoId,
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
}: {
	geoId: GeoId;
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
}): Promise<string> => {
	const personalData = extractPersonalDataFromForm(formData);
	const { billingAddress, deliveryAddress } = hasDeliveryAddress
		? extractDeliverableAddressDataFromForm(formData)
		: extractNonDeliverableAddressDataFromForm(formData);

	const ophanIds = getOphanIds();
	const referrerAcquisitionData = {
		...getReferrerAcquisitionData(),
		labels: ['generic-checkout'], // Shall we get rid of this now?
	};

	// The product information can be calculated higher up the call stack
	// once we get rid of the old product fields mechanism.
	const productInformationAmount =
		productFields.productType === 'Contribution' ||
		productFields.productType === 'SupporterPlus'
			? productFields.amount
			: undefined;

	const productInformation: ProductPurchase = productPurchaseSchema.parse({
		product: productKey,
		ratePlan: ratePlanKey,
		amount: productInformationAmount,
	});

	const firstDeliveryDate = getFirstDeliveryDateForProduct(
		productKey,
		productFields,
	);

	const promoCode = promotion?.promoCode;
	const appliedPromotion =
		promoCode !== undefined
			? {
					promoCode,
					countryGroupId: geoId,
			  }
			: undefined;
	const supportAbTests = getSupportAbTests(abParticipations);
	const deliveryInstructions = formData.get('deliveryInstructions') as string;
	const similarProductsConsent = getConsentValue(formData, CONSENT_ID);

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
			geoId,
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
			geoId,
			paymentRequest,
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
	appliedPromotion?: { promoCode: string; countryGroupId: GeoId };
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	contributionAmount: number | undefined;
	paymentMethod: PaymentMethod;
	geoId: GeoId;
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
	geoId,
	paymentRequest,
}: {
	personalData: FormPersonalFields;
	appliedPromotion?: { promoCode: string; countryGroupId: GeoId };
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	contributionAmount: number | undefined;
	paymentMethod: PaymentMethod;
	geoId: GeoId;
	paymentRequest: RegularPaymentRequest;
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
			geoId,
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
	geoId: GeoId,
) => {
	const order = {
		firstName: personalData.firstName,
		email: personalData.email,
		paymentMethod: paymentMethod,
		status: status,
	};
	setThankYouOrder(order);
	const thankYouUrlSearchParams = new URLSearchParams();
	thankYouUrlSearchParams.set('product', productKey);
	thankYouUrlSearchParams.set('ratePlan', ratePlanKey);
	promoCode && thankYouUrlSearchParams.set('promoCode', promoCode);
	userType && thankYouUrlSearchParams.set('userType', userType);
	contributionAmount &&
		thankYouUrlSearchParams.set('contribution', contributionAmount.toString());
	return `/${geoId}/thank-you?${thankYouUrlSearchParams.toString()}`;
};
