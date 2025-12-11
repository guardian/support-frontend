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
import type { GuardianWeeklyProductPurchase } from '../emailFields/guardianWeeklyEmailFields';
import { buildGuardianWeeklyEmailFields } from '../emailFields/guardianWeeklyEmailFields';
import type { PaperProductPurchase } from '../emailFields/paperEmailFields';
import { buildPaperEmailFields } from '../emailFields/paperEmailFields';
import { buildSupporterPlusEmailFields } from '../emailFields/supporterPlusEmailFields';
import type { TierThreeProductPurchase } from '../emailFields/tierThreeEmailFields';
import { buildTierThreeEmailFields } from '../emailFields/tierThreeEmailFields';
import type { PaymentMethodType } from '../model/paymentMethod';
import type { ProductType } from '../model/productType';
import type {
	SendAcquisitionEventState,
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

async function getFieldsFromState(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	const fixedTerm = isFixedTerm(
		await productCatalogProvider.getServiceForUser(
			sendThankYouEmailState.user.isTestUser,
		),
		sendThankYouEmailState.productInformation,
	);
	return {
		today: dayjs(),
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
		isFixedTerm: fixedTerm,
	};
}

async function sendSupporterPlusEmail(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	await sendEmailWithStage(
		buildSupporterPlusEmailFields(
			await getFieldsFromState(sendThankYouEmailState),
		),
	);
}

async function sendContributionEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: Extract<ProductPurchase, { product: 'Contribution' }>,
) {
	await sendEmailWithStage(
		buildContributionEmailFields({
			...(await getFieldsFromState(sendThankYouEmailState)),
			amount: productInformation.amount,
			ratePlan: productInformation.ratePlan,
		}),
	);
}

async function sendDigitalSubscriptionEmail(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	await sendEmailWithStage(
		buildDigitalSubscriptionEmailFields(
			await getFieldsFromState(sendThankYouEmailState),
		),
	);
}

async function sendPaperEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: PaperProductPurchase,
) {
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
			...(await getFieldsFromState(sendThankYouEmailState)),
			productInformation: productInformation,
			deliveryAgentDetails: deliveryAgent,
		}),
	);
}

async function sendTierThreeEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: TierThreeProductPurchase,
) {
	await sendEmailWithStage(
		buildTierThreeEmailFields({
			...(await getFieldsFromState(sendThankYouEmailState)),
			firstDeliveryDate: dayjs(productInformation.firstDeliveryDate),
		}),
	);
}

async function sendGuardianWeeklyEmail(
	sendThankYouEmailState: SendThankYouEmailState,
	productInformation: GuardianWeeklyProductPurchase,
) {
	if (sendThankYouEmailState.productType === 'GuardianWeekly') {
		await sendEmailWithStage(
			buildGuardianWeeklyEmailFields({
				...(await getFieldsFromState(sendThankYouEmailState)),
				firstDeliveryDate: dayjs(productInformation.firstDeliveryDate),
				giftRecipient: sendThankYouEmailState.giftRecipient,
			}),
		);
	}
	throw new Error(
		`Invalid product type ${sendThankYouEmailState.productType} for Guardian Weekly email`,
	);
}

async function sendGuardianAdLiteEmail(
	sendThankYouEmailState: SendThankYouEmailState,
) {
	await sendEmailWithStage(
		buildGuardianAdLiteEmailFields(
			await getFieldsFromState(sendThankYouEmailState),
		),
	);
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
			await sendSupporterPlusEmail(sendThankYouEmailState);
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

	return { success: true };
};

function getDeliveryAgent(refId: number, agents: DeliveryAgentDetails[]) {
	return agents.find((agent) => agent.refid === refId);
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

export function getBillingPeriod(productType: ProductType) {
	if (productType.productType === 'GuardianAdLite') {
		return BillingPeriod.Monthly;
	}
	return productType.billingPeriod;
}

export async function getMandateId(
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
