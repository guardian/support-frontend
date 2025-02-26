import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import type { ProductFields } from '../../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import { formatMachineDate } from '../../../../helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from '../../../paper-subscription-checkout/helpers/homeDeliveryDays';
import { getPaymentStartDate } from '../../../paper-subscription-checkout/helpers/subsCardDays';
import { getTierThreeDeliveryDate } from '../../../weekly-subscription-checkout/helpers/deliveryDays';

export const getFirstDeliveryDateForProduct = (
	productKey: ActiveProductKey,
	productFields: ProductFields,
): string | null => {
	switch (productKey) {
		case 'TierThree':
			return formatMachineDate(getTierThreeDeliveryDate());
		case 'NationalDelivery':
		case 'HomeDelivery': {
			if (productFields.productType !== 'Paper') {
				throw new Error('Product fields are not of type PaperSubscription');
			}
			return formatMachineDate(
				getHomeDeliveryDays(
					Date.now(),
					productFields.productOptions,
				)[0] as Date,
			);
		}
		case 'SubscriptionCard': {
			if (productFields.productType !== 'Paper') {
				throw new Error('Product fields are not of type PaperSubscription');
			}
			return formatMachineDate(
				getPaymentStartDate(Date.now(), productFields.productOptions),
			);
		}
		default:
			return null;
	}
};
