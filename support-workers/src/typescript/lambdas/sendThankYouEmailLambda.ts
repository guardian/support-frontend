import { getProductRatePlan } from '@guardian/support-service-lambdas/modules/zuora/src/createSubscription/getProductRatePlan';
import { sendEmail } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import type { ProductCatalog } from '@modules/product-catalog/productCatalog';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import dayjs from 'dayjs';
import { buildContributionEmailFields } from '../emailFields/contributionEmailFields';
import { buildDigitalSubscriptionEmailFields } from '../emailFields/digitalSubscriptionEmailFields';
import { buildSupporterPlusEmailFields } from '../emailFields/supporterPlusEmailFields';
import type { PaymentMethod } from '../model/paymentMethod';
import type { ProductType } from '../model/productType';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();

const productCatalogProvider = new ServiceProvider(stage, async (stage) => {
	return getProductCatalogFromApi(stage);
});

export const handler = async (
	state: WrappedState<SendAcquisitionEventState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);
	const sendThankYouEmailState = state.state.sendThankYouEmailState;
	const productInformation = getIfDefined(
		sendThankYouEmailState.productInformation,
		'productInformation is required',
	);

	const fixedTerm = isFixedTerm(
		await productCatalogProvider.getServiceForUser(
			sendThankYouEmailState.user.isTestUser,
		),
		productInformation,
	);

	switch (productInformation.product) {
		case 'Contribution':
			await sendEmail(
				stage,
				buildContributionEmailFields({
					now: dayjs(),
					user: sendThankYouEmailState.user,
					amount: productInformation.amount,
					currency: sendThankYouEmailState.product.currency,
					paymentMethod: sendThankYouEmailState.paymentMethod,
					mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
					ratePlan: productInformation.ratePlan,
				}),
			);
			break;
		case 'SupporterPlus':
			if (sendThankYouEmailState.productType === 'SupporterPlus') {
				await sendEmail(
					stage,
					buildSupporterPlusEmailFields({
						now: dayjs(),
						user: sendThankYouEmailState.user,
						currency: sendThankYouEmailState.product.currency,
						billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
						subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
						isFixedTerm: fixedTerm,
						paymentSchedule: sendThankYouEmailState.paymentSchedule,
						paymentMethod: sendThankYouEmailState.paymentMethod,
						mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
					}),
				);
			} else {
				throw new Error('Product type mismatch: expected SupporterPlus');
			}
			break;
		case 'DigitalSubscription':
			if (sendThankYouEmailState.productType === 'DigitalSubscription') {
				// TODO: This needs testing once the new email template is ready
				await sendEmail(
					stage,
					buildDigitalSubscriptionEmailFields({
						user: sendThankYouEmailState.user,
						currency: sendThankYouEmailState.product.currency,
						billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
						subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
						paymentSchedule: sendThankYouEmailState.paymentSchedule,
						paymentMethod: sendThankYouEmailState.paymentMethod,
						mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
					}),
				);
			} else {
				throw new Error('Product type mismatch: expected DigitalPack');
			}
			break;
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
function isFixedTerm(
	productCatalog: ProductCatalog,
	productInformation: ProductPurchase,
) {
	const productRatePlan = getProductRatePlan(
		productCatalog,
		productInformation,
	);
	return productRatePlan.termType === 'FixedTerm';
}
function getBillingPeriod(productType: ProductType) {
	if (productType.productType === 'GuardianAdLite') {
		return BillingPeriod.Monthly;
	}
	return productType.billingPeriod;
}

function getMandateId(paymentMethod: PaymentMethod) {
	if (paymentMethod.Type === 'BankTransfer') {
		return 'Mandate'; // TODO: retrieve actual mandate ID
	}
	return;
}
