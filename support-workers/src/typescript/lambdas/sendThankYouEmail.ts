import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductType } from '../model/productType';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import type { WrappedState } from '../model/stateSchemas';
import type { ThankYouEmailFields } from '../model/thankYouEmailFields';
import {
	buildContributionThankYouEmailFields,
	buildSupporterPlusThankYouEmailFields,
} from '../model/thankYouEmailFields';
import { getIfDefined } from '../util/nullAndUndefined';

export const handler = async (
	state: WrappedState<SendAcquisitionEventState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);
	const sendThankYouEmailState = state.state.sendThankYouEmailState;
	const productInformation = getIfDefined(
		sendThankYouEmailState.productInformation,
		'productInformation is required',
	);
	switch (productInformation.product) {
		case 'Contribution':
			sendEmail(
				buildContributionThankYouEmailFields(
					sendThankYouEmailState.user,
					productInformation.amount,
					sendThankYouEmailState.product.currency,
					productInformation.ratePlan,
				),
			);
			break;
		case 'SupporterPlus':
			sendEmail(
				buildSupporterPlusThankYouEmailFields(
					sendThankYouEmailState.user,
					sendThankYouEmailState.product.currency,
					getBillingPeriod(sendThankYouEmailState.product),
					sendThankYouEmailState.subscriptionNumber,
				),
			);
			break;
		// case 'DigitalSubscription':
		// 	sendDigitalSubscriptionEmail();
		// 	break;
		// case 'NationalDelivery':
		// case 'SubscriptionCard':
		// case 'HomeDelivery':
		// 	sendPaperEmail();
		// 	break;
		// case 'TierThree':
		// 	sendTierThreeEmail();
		// 	break;
		// case 'GuardianWeeklyDomestic':
		// case 'GuardianWeeklyRestOfWorld':
		// 	sendGuardianWeeklyEmail();
		// 	break;
		// case 'GuardianAdLite':
		// 	sendGuardianAdLiteEmail();
		// 	break;
	}

	return Promise.resolve({ success: true });
};

function getBillingPeriod(productType: ProductType) {
	if (productType.productType === 'GuardianAdLite') {
		return BillingPeriod.Monthly;
	}
	return productType.billingPeriod;
}

function sendEmail(emailFields: ThankYouEmailFields) {
	console.log(`Sending email with fields: ${JSON.stringify(emailFields)}`);
}
