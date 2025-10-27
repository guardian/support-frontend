import type { ProductFields } from '../../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { ActiveProductKey } from '../../../../helpers/productCatalog';
import { isActivePaperProductOption } from '../../../../helpers/productCatalogToProductOption';
import { formatMachineDate } from '../../../../helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from '../../../paper-subscription-checkout/helpers/homeDeliveryDays';
import { getPaymentStartDate } from '../../../paper-subscription-checkout/helpers/subsCardDays';
import { getTierThreeDeliveryDate } from './deliveryDays';

export const getFirstDeliveryDateForProduct = (
	productKey: ActiveProductKey,
	productFields: ProductFields,
): string | null => {
	switch (productKey) {
		case 'TierThree':
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return formatMachineDate(getTierThreeDeliveryDate());
		case 'NationalDelivery':
		case 'HomeDelivery':
		case 'SubscriptionCard': {
			if (
				productFields.productType !== 'Paper' ||
				!isActivePaperProductOption(productFields.productOptions)
			) {
				throw new Error(
					// 'Should not be possible'™
					`Invalid product fields ${JSON.stringify(productFields)}`,
				);
			}
			const firstDeliveryDate =
				productKey === 'SubscriptionCard'
					? getPaymentStartDate(Date.now(), productFields.productOptions)
					: (getHomeDeliveryDays(
							Date.now(),
							productFields.productOptions,
					  )[0] as Date);

			return formatMachineDate(firstDeliveryDate);
		}
		default:
			return null;
	}
};
