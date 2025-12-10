import type {
	DataExtensionName,
	EmailMessageWithIdentityUserId,
} from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import type { DeliveryAgentDetails } from '../services/paperRound';
import { buildDeliveryEmailFields } from './deliveryEmailFields';
import { buildThankYouEmailFields } from './emailFields';

type PaperProductPurchase = Extract<
	ProductPurchase,
	{ product: 'NationalDelivery' | 'HomeDelivery' | 'SubscriptionCard' }
>;

export function buildPaperEmailFields({
	today,
	user,
	currency,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
	productInformation,
	deliveryAgentDetails,
}: {
	today: Dayjs;
	user: User;
	currency: IsoCurrency;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
	productInformation: PaperProductPurchase;
	deliveryAgentDetails?: DeliveryAgentDetails;
}): EmailMessageWithIdentityUserId {
	const deliveryAgentFields =
		productInformation.product === 'NationalDelivery' && deliveryAgentDetails
			? {
					delivery_agent_name: deliveryAgentDetails.agentname,
					delivery_agent_telephone: deliveryAgentDetails.telephone,
					delivery_agent_email: deliveryAgentDetails.email,
					delivery_agent_address1: deliveryAgentDetails.address1,
					delivery_agent_address2: deliveryAgentDetails.address2,
					delivery_agent_town: deliveryAgentDetails.town,
					delivery_agent_county: deliveryAgentDetails.county,
					delivery_agent_postcode: deliveryAgentDetails.postcode,
			  }
			: undefined;

	const deliveryFields = buildDeliveryEmailFields({
		today: today,
		user: user,
		subscriptionNumber: subscriptionNumber,
		currency: currency,
		billingPeriod: BillingPeriod.Monthly, // Paper products are always monthly
		paymentMethod: paymentMethod,
		paymentSchedule: paymentSchedule,
		firstDeliveryDate: dayjs(productInformation.firstDeliveryDate),
		isFixedTerm: false, // There are no fixed term paper products
		mandateId: mandateId,
	});
	const productFields = {
		package: productInformation.ratePlan,
		...deliveryAgentFields,
		...deliveryFields,
	};
	return buildThankYouEmailFields(
		user,
		getDataExtensionName(productInformation),
		productFields,
	);
}

function getDataExtensionName(
	productInformation: ProductPurchase,
): DataExtensionName {
	if (
		productInformation.product === 'HomeDelivery' &&
		productInformation.ratePlan === 'Sunday'
	) {
		return DataExtensionNames.homeDeliveryObserverDay0Email;
	}
	if (
		productInformation.product === 'SubscriptionCard' &&
		productInformation.ratePlan === 'Sunday'
	) {
		return DataExtensionNames.subscriptionCardObserverDay0Email;
	}
	if (productInformation.product === 'HomeDelivery') {
		return DataExtensionNames.homeDeliveryDay0Email;
	}
	if (productInformation.product === 'NationalDelivery') {
		return DataExtensionNames.nationalDeliveryDay0Email;
	}
	return DataExtensionNames.subscriptionCardDay0Email;
}
