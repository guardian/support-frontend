import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
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
