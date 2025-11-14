import { getProductRatePlan } from '@guardian/support-service-lambdas/modules/zuora/src/createSubscription/getProductRatePlan';
import { sendEmail } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import type { ProductCatalog } from '@modules/product-catalog/productCatalog';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import dayjs from 'dayjs';
import { buildContributionEmailFields } from '../emailFields/contributionEmailFields';
import { buildDigitalSubscriptionEmailFields } from '../emailFields/digitalSubscriptionEmailFields';
import { buildPaperEmailFields } from '../emailFields/paperEmailFields';
import { buildSupporterPlusEmailFields } from '../emailFields/supporterPlusEmailFields';
import { buildTierThreeEmailFields } from '../emailFields/tierThreeEmailFields';
import type { PaymentMethod } from '../model/paymentMethod';
import type { ProductType } from '../model/productType';
import type {
	SendAcquisitionEventState,
	SendThankYouEmailProductType,
	SendThankYouEmailState,
} from '../model/sendAcquisitionEventState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import type { DeliveryAgentDetails } from '../services/paperRound';
import { getPaperRoundConfig, PaperRoundService } from '../services/paperRound';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();

const productCatalogProvider = new ServiceProvider(stage, async (stage) => {
	return getProductCatalogFromApi(stage);
});

const deliveryAgentsProvider = new ServiceProvider(stage, async (stage) => {
	const paperRoundConfig = await getPaperRoundConfig(stage);
	const paperRoundService = new PaperRoundService(paperRoundConfig);
	return await paperRoundService.agents();
});

function getDeliveryAgent(refId: number, agents: DeliveryAgentDetails[]) {
	return agents.find((agent) => agent.refid === refId);
}

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
			if (checkStateProductType('SupporterPlus', sendThankYouEmailState)) {
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
			}
			break;
		case 'DigitalSubscription':
			if (
				checkStateProductType('DigitalSubscription', sendThankYouEmailState)
			) {
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
			}
			break;
		case 'NationalDelivery':
			if (checkStateProductType('Paper', sendThankYouEmailState)) {
				const deliveryAgent = getDeliveryAgent(
					productInformation.deliveryAgent,
					await deliveryAgentsProvider.getServiceForUser(
						sendThankYouEmailState.user.isTestUser,
					),
				);
				await sendEmail(
					stage,
					buildPaperEmailFields({
						user: sendThankYouEmailState.user,
						currency: sendThankYouEmailState.product.currency,
						subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
						paymentSchedule: sendThankYouEmailState.paymentSchedule,
						paymentMethod: sendThankYouEmailState.paymentMethod,
						mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
						productInformation: productInformation,
						deliveryAgentDetails: deliveryAgent,
					}),
				);
			}
			break;
		case 'SubscriptionCard':
		case 'HomeDelivery':
			if (checkStateProductType('Paper', sendThankYouEmailState)) {
				await sendEmail(
					stage,
					buildPaperEmailFields({
						user: sendThankYouEmailState.user,
						currency: sendThankYouEmailState.product.currency,
						subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
						paymentSchedule: sendThankYouEmailState.paymentSchedule,
						paymentMethod: sendThankYouEmailState.paymentMethod,
						mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
						productInformation: productInformation,
					}),
				);
			}
			break;
		case 'TierThree':
			if (checkStateProductType('TierThree', sendThankYouEmailState)) {
				await sendEmail(
					stage,
					buildTierThreeEmailFields({
						user: sendThankYouEmailState.user,
						currency: sendThankYouEmailState.product.currency,
						billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
						subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
						paymentSchedule: sendThankYouEmailState.paymentSchedule,
						paymentMethod: sendThankYouEmailState.paymentMethod,
						mandateId: getMandateId(sendThankYouEmailState.paymentMethod),
						productInformation: productInformation,
					}),
				);
			}
			break;
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

function checkStateProductType<T extends SendThankYouEmailProductType>(
	productTypeName: T,
	state: SendThankYouEmailState,
): state is SendThankYouEmailState & { productType: T } {
	if (state.productType === productTypeName) {
		return true;
	}
	throw new Error('Product type mismatch: expected ' + productTypeName);
}

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
