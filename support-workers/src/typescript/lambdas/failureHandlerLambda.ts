import { buildEmailFields } from '@modules/email/dataFields/dayZero/emailFields';
import type { DataExtensionName } from '@modules/email/email';
import { DataExtensionNames, sendEmail } from '@modules/email/email';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { checkoutFailureReasonFromErrorMessage } from '../errors/checkoutFailureReasons';
import { errorFromStateSchema } from '../errors/errorFromStateSchema';
import { isTransactionDeclinedError } from '../errors/transactionDeclinedErrors';
import type { CheckoutFailureState } from '../model/checkoutFailureState';
import type { FailureHandlerState } from '../model/failureHandlerState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { stringifyWithCmpConsentRedacted } from '../util/logging';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();

function getDataExtensionName(
	product: ProductKey,
): DataExtensionName | undefined {
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
		case 'Patron':
			console.log('Skipping failure email for Patrons');
			return;
		case 'GuardianPatron':
		case 'GuardianWeeklyZoneA':
		case 'GuardianWeeklyZoneB':
		case 'GuardianWeeklyZoneC':
		case 'NewspaperVoucher':
		case 'OneTimeContribution':
		case 'PartnerMembership':
		case 'PatronMembership':
		case 'SupporterMembership':
			throw new Error(`No failed checkout email for product type: ${product}`);
	}
}

async function sendFailureEmail(state: FailureHandlerState) {
	const dataExtensionName = getDataExtensionName(
		state.productInformation.product,
	);

	if (dataExtensionName) {
		const emailFields = buildEmailFields(state.user, dataExtensionName, {});
		await sendEmail(stage, emailFields);
	}
}

function handleError(
	state: WrappedState<FailureHandlerState>,
): WrappedState<CheckoutFailureState> {
	console.info('Trying to handle checkout error');
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
		state: checkoutFailureState,
		requestInfo: {
			...state.requestInfo,
			failed: shouldTriggerAlarm,
		},
	};
}

export const handler = async (state: WrappedState<FailureHandlerState>) => {
	console.info(`Input is ${stringifyWithCmpConsentRedacted(state)}`);
	await sendFailureEmail(state.state);
	return handleError(state);
};
