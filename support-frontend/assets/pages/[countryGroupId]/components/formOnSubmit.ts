import type { Promotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import type { Participations } from '../../../helpers/abTests/models';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import type {
	ProductFields,
	RegularPaymentFields,
	RegularPaymentRequest,
} from '../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { ActiveProductKey } from '../../../helpers/productCatalog';
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
import { createSubscription } from './createSubscription';
import type { PaymentMethod } from './paymentFields';
import { FormSubmissionError } from './paymentFields';

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
	ratePlanKey: string;
	formData: FormData;
	paymentMethod: PaymentMethod;
	paymentFields: RegularPaymentFields;
	productFields: ProductFields;
	hasDeliveryAddress: boolean;
	abParticipations: Participations;
	promotion: Promotion | undefined;
	contributionAmount: number | undefined;
}) => {
	const personalData = extractPersonalDataFromForm(formData);
	const { billingAddress, deliveryAddress } = hasDeliveryAddress
		? extractDeliverableAddressDataFromForm(formData)
		: extractNonDeliverableAddressDataFromForm(formData);

	const ophanIds = getOphanIds();
	const referrerAcquisitionData = {
		...getReferrerAcquisitionData(),
		labels: ['generic-checkout'], // Shall we get rid of this now?
	};

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
		deliveryInstructions,
		debugInfo: '',
	};

	const createSubscriptionResult = await createSubscription(
		createSupportWorkersRequest,
	);

	if (
		createSubscriptionResult.status === 'success' ||
		createSubscriptionResult.status === 'pending'
	) {
		return buildThankYouPageUrl(
			productKey,
			ratePlanKey,
			promoCode,
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
	ratePlanKey: string,
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
