import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { sendEmail } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import type { ProductCatalog } from '@modules/product-catalog/productCatalog';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import { getProductRatePlan } from '@modules/zuora/createSubscription/getProductRatePlan';
import { getPaymentMethods } from '@modules/zuora/paymentMethod';
import { ZuoraClient } from '@modules/zuora/zuoraClient';
import dayjs from 'dayjs';
import { buildContributionEmailFields } from '../emailFields/contributionEmailFields';
import { buildDigitalSubscriptionEmailFields } from '../emailFields/digitalSubscriptionEmailFields';
import { buildGuardianAdLiteEmailFields } from '../emailFields/guardianAdLiteEmailFields';
import { buildGuardianWeeklyEmailFields } from '../emailFields/guardianWeeklyEmailFields';
import { buildPaperEmailFields } from '../emailFields/paperEmailFields';
import { buildSupporterPlusEmailFields } from '../emailFields/supporterPlusEmailFields';
import type { TierThreeProductPurchase } from '../emailFields/tierThreeEmailFields';
import { buildTierThreeEmailFields } from '../emailFields/tierThreeEmailFields';
import type { PaymentMethodType } from '../model/paymentMethod';
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

const zuoraServiceProvider = new ServiceProvider(stage, async (stage) => {
	return ZuoraClient.create(stage);
});

async function sendSupporterPlusEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: Extract<ProductPurchase, { product: 'SupporterPlus' }>,
) {
	// We've checked that the ProductPurchase is of type SupporterPlus, but we also need to check
	// that the SendThankYouEmailState is of type SupporterPlus to satisfy TypeScript. Once we
	// are using the ProductPurchase information exclusively we can refactor this out.
	if (checkStateProductType('SupporterPlus', sendThankYouEmailState)) {
		const fixedTerm = isFixedTerm(
			await productCatalogProvider.getServiceForUser(
				sendThankYouEmailState.user.isTestUser,
			),
			productInformation,
		);
		await sendEmailWithStage(
			buildSupporterPlusEmailFields({
				now: dayjs(),
				user: sendThankYouEmailState.user,
				currency: sendThankYouEmailState.product.currency,
				billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				isFixedTerm: fixedTerm,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
			}),
		);
	}
}

async function sendContributionEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: Extract<ProductPurchase, { product: 'Contribution' }>,
) {
	if (checkStateProductType('Contribution', sendThankYouEmailState)) {
		await sendEmailWithStage(
			buildContributionEmailFields({
				now: dayjs(),
				user: sendThankYouEmailState.user,
				amount: productInformation.amount,
				currency: sendThankYouEmailState.product.currency,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
				ratePlan: productInformation.ratePlan,
			}),
		);
	}
}

async function sendDigitalSubscriptionEmail(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	if (checkStateProductType('DigitalSubscription', sendThankYouEmailState)) {
		await sendEmailWithStage(
			buildDigitalSubscriptionEmailFields({
				user: sendThankYouEmailState.user,
				currency: sendThankYouEmailState.product.currency,
				billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
			}),
		);
	}
}

async function sendPaperEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: Extract<
		ProductPurchase,
		{ product: 'NationalDelivery' | 'SubscriptionCard' | 'HomeDelivery' }
	>,
) {
	if (checkStateProductType('Paper', sendThankYouEmailState)) {
		const deliveryAgent =
			productInformation.product === 'NationalDelivery'
				? getDeliveryAgent(
						productInformation.deliveryAgent,
						await deliveryAgentsProvider.getServiceForUser(
							sendThankYouEmailState.user.isTestUser,
						),
				  )
				: undefined;
		await sendEmailWithStage(
			buildPaperEmailFields({
				user: sendThankYouEmailState.user,
				currency: sendThankYouEmailState.product.currency,
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
				productInformation: productInformation,
				deliveryAgentDetails: deliveryAgent,
			}),
		);
	}
}

async function sendTierThreeEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: TierThreeProductPurchase,
) {
	if (checkStateProductType('TierThree', sendThankYouEmailState)) {
		await sendEmailWithStage(
			buildTierThreeEmailFields({
				user: sendThankYouEmailState.user,
				currency: sendThankYouEmailState.product.currency,
				billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
				productInformation: productInformation,
			}),
		);
	}
}

async function sendGuardianWeeklyEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: Extract<
		ProductPurchase,
		{ product: 'GuardianWeeklyDomestic' | 'GuardianWeeklyRestOfWorld' }
	>,
) {
	if (checkStateProductType('GuardianWeekly', sendThankYouEmailState)) {
		await sendEmailWithStage(
			buildGuardianWeeklyEmailFields({
				user: sendThankYouEmailState.user,
				currency: sendThankYouEmailState.product.currency,
				billingPeriod: getBillingPeriod(sendThankYouEmailState.product),
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				mandateId: await getMandateId(
					sendThankYouEmailState.user.isTestUser,
					sendThankYouEmailState.paymentMethod.Type,
					sendThankYouEmailState.accountNumber,
				),
				productInformation: productInformation,
				giftRecipient: sendThankYouEmailState.giftRecipient,
			}),
		);
	}
}

async function sendGuardianAdLiteEmail(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	if (checkStateProductType('GuardianAdLite', sendThankYouEmailState)) {
		await sendEmailWithStage(
			buildGuardianAdLiteEmailFields({
				user: sendThankYouEmailState.user,
				subscriptionNumber: sendThankYouEmailState.subscriptionNumber,
				currency: sendThankYouEmailState.product.currency,
				paymentMethod: sendThankYouEmailState.paymentMethod,
				paymentSchedule: sendThankYouEmailState.paymentSchedule,
			}),
		);
	}
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

	switch (productInformation.product) {
		case 'Contribution':
			await sendContributionEmail(sendThankYouEmailState, productInformation);
			break;
		case 'SupporterPlus':
			await sendSupporterPlusEmail(sendThankYouEmailState, productInformation);
			break;
		case 'DigitalSubscription':
			await sendDigitalSubscriptionEmail(sendThankYouEmailState);
			break;
		case 'NationalDelivery':
		case 'SubscriptionCard':
		case 'HomeDelivery':
			await sendPaperEmail(sendThankYouEmailState, productInformation);
			break;
		case 'TierThree':
			await sendTierThreeEmail(sendThankYouEmailState, productInformation);
			break;
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			await sendGuardianWeeklyEmail(sendThankYouEmailState, productInformation);
			break;
		case 'GuardianAdLite':
			await sendGuardianAdLiteEmail(sendThankYouEmailState);
			break;
	}

	return Promise.resolve({ success: true });
};

function getDeliveryAgent(refId: number, agents: DeliveryAgentDetails[]) {
	return agents.find((agent) => agent.refid === refId);
}

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

async function getMandateId(
	isTestUser: boolean,
	paymentMethodType: PaymentMethodType,
	accountNumber: string,
) {
	if (paymentMethodType === 'BankTransfer') {
		const response = await getPaymentMethods(
			await zuoraServiceProvider.getServiceForUser(isTestUser),
			accountNumber,
		);
		return response.banktransfer?.[0]?.mandateInfo.mandateId ?? undefined;
	}
	return;
}

function sendEmailWithStage(fields: EmailMessageWithIdentityUserId) {
	return sendEmail(stage, fields);
}
