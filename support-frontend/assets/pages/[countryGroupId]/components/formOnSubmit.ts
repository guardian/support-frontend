import type { Promotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import type { Participations } from '../../../helpers/abTests/models';
import type { ErrorReason } from '../../../helpers/forms/errorReasons';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import type {
	ProductFields,
	RegularPaymentFields,
	RegularPaymentRequest,
	StatusResponse,
} from '../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { ActiveProductKey } from '../../../helpers/productCatalog';
import type { UserType } from '../../../helpers/redux/checkout/personalDetails/state';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from '../../../helpers/tracking/acquisitions';
import { formatMachineDate } from '../../../helpers/utilities/dateConversions';
import { getTierThreeDeliveryDate } from '../../weekly-subscription-checkout/helpers/deliveryDays';
import type { FormPersonalFields } from '../checkout/helpers/formDataExtractors';
import {
	extractDeliverableAddressDataFromForm,
	extractNonDeliverableAddressDataFromForm,
	extractPersonalDataFromForm,
} from '../checkout/helpers/formDataExtractors';
import { setThankYouOrder } from '../checkout/helpers/sessionStorage';
import type { PaymentMethod } from './paymentFields';
import { FormSubmissionError } from './paymentFields';
import type { ProcessPaymentResponse } from './retryPaymentStatus';
import { processPaymentWithRetries } from './retryPaymentStatus';

type CreateSubscriptionResponse = StatusResponse & {
	userType: UserType;
};

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

	const createResponse = await createNewSupportWorkersExecution(
		createSupportWorkersRequest,
	);
	const { userType, processPaymentResponse } = await pollForStatusOfExecution(
		createResponse,
	);

	if (
		processPaymentResponse.status === 'success' ||
		processPaymentResponse.status === 'pending'
	) {
		goToThankYouPage(
			productKey,
			ratePlanKey,
			promoCode,
			userType,
			contributionAmount,
			personalData,
			paymentMethod,
			processPaymentResponse.status,
			geoId,
		);
	} else {
		console.error(
			'processPaymentResponse error:',
			processPaymentResponse.failureReason,
		);
		throw new FormSubmissionError(
			'Sorry, something went wrong.',
			appropriateErrorMessage(
				processPaymentResponse.failureReason ?? 'unknown',
			),
		);
	}
};

const createNewSupportWorkersExecution = async (
	createSupportWorkersRequest: RegularPaymentRequest,
): Promise<Response> => {
	return fetch('/subscribe/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createSupportWorkersRequest),
	});
};

const pollForStatusOfExecution = async (
	createResponse: Response,
): Promise<{
	userType: UserType | undefined;
	processPaymentResponse: ProcessPaymentResponse;
}> => {
	if (createResponse.ok) {
		const statusResponse =
			(await createResponse.json()) as CreateSubscriptionResponse;
		const processPaymentResponse = await processPaymentWithRetries(
			statusResponse,
		);
		return {
			userType: statusResponse.userType,
			processPaymentResponse,
		};
	} else {
		const errorReason = (await createResponse.text()) as ErrorReason;
		return {
			userType: undefined,
			processPaymentResponse: {
				status: 'failure',
				failureReason: errorReason,
			},
		};
	}
};

const goToThankYouPage = (
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
	window.location.href = `/${geoId}/thank-you?${thankYouUrlSearchParams.toString()}`;
};
