import type { DataExtensionName } from '@modules/email/email';
import { DataExtensionNames, sendEmail } from '@modules/email/email';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { buildEmailFields } from '../emailFields/emailFields';
import { checkoutFailureReasonFromErrorMessage } from '../errors/checkoutFailureReasons';
import { errorFromStateSchema } from '../errors/errorFromStateSchema';
import { isTransactionDeclinedError } from '../errors/zuoraErrors';
import type { CheckoutFailureState } from '../model/checkoutFailureState';
import type { FailureHandlerState } from '../model/failureHandlerState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();

function getDataExtensionName(product: ProductKey): DataExtensionName {
	switch (product) {
		case 'DigitalSubscription':
			return DataExtensionNames.failedCheckoutEmails.digitalSubscription;
		case 'Contribution':
			return DataExtensionNames.failedCheckoutEmails.recurringContribution;
		case 'SupporterPlus':
			return DataExtensionNames.failedCheckoutEmails.supporterPlus;
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return DataExtensionNames.failedCheckoutEmails.guardianWeekly;
		case 'HomeDelivery':
		case 'NationalDelivery':
		case 'SubscriptionCard':
			return DataExtensionNames.failedCheckoutEmails.paper;
		case 'TierThree':
			return DataExtensionNames.failedCheckoutEmails.tierThree;
		case 'GuardianAdLite':
			return DataExtensionNames.failedCheckoutEmails.guardianAdLite;
		default:
			throw new Error(`Unknown product type: ${product}`);
	}
}

async function sendFailureEmail(state: FailureHandlerState) {
	const dataExtensionName = getDataExtensionName(
		state.productInformation.product,
	);
	const emailFields = buildEmailFields(state.user, dataExtensionName, {});
	await sendEmail(stage, emailFields);
}

function handleError(state: WrappedState<FailureHandlerState>) {
	console.info(`Trying to handle error ${JSON.stringify(state.error)}`);
	const causingError = errorFromStateSchema.parse(
		JSON.parse(getIfDefined(state.error?.Cause, 'No Cause error found')),
	);
	const shouldTriggerAlarm = !isTransactionDeclinedError(
		causingError.errorMessage,
	);
	const checkoutFailureReason = checkoutFailureReasonFromErrorMessage(
		causingError.errorMessage,
	);
	const checkoutFailureState: CheckoutFailureState = {
		user: state.state.user,
		checkoutFailureReason,
	};
	return {
		checkoutFailureState,
		requestInfo: {
			...state.requestInfo,
			failed: shouldTriggerAlarm,
		},
	};
}

export const handler = async (state: WrappedState<FailureHandlerState>) => {
	console.info(`Input is ${JSON.stringify(state)}`);
	await sendFailureEmail(state.state);
	return handleError(state);
};
