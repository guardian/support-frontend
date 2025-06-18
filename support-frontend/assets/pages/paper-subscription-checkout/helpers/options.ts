import type { FulfilmentOptions } from '@modules/productCatalog/fulfilmentOptions';
import { HomeDelivery } from '@modules/productCatalog/fulfilmentOptions';
import type { ProductOptions } from '@modules/productCatalog/productOptions';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getVoucherDays } from 'pages/paper-subscription-checkout/helpers/voucherDeliveryDays';

function getDays(
	fulfilmentOption: FulfilmentOptions,
	productOption: ProductOptions,
): Date[] {
	return fulfilmentOption === HomeDelivery
		? getHomeDeliveryDays(Date.now(), productOption)
		: getVoucherDays(Date.now(), productOption);
}

export { getDays };
