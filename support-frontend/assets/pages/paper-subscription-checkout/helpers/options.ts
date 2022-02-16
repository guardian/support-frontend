import type {
	FulfilmentOptions,
	PaperFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type {
	PaperProductOptions,
	ProductOptions,
} from 'helpers/productPrice/productOptions';
import {
	ActivePaperProductTypes,
	Everyday,
} from 'helpers/productPrice/productOptions';
import { getQueryParameter } from 'helpers/urls/url';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getVoucherDays } from 'pages/paper-subscription-checkout/helpers/voucherDeliveryDays';

function getProductOption(): PaperProductOptions {
	const productInUrl = getQueryParameter('product') as PaperProductOptions;

	return ActivePaperProductTypes.includes(productInUrl)
		? productInUrl
		: Everyday;
}

function getFulfilmentOption(): PaperFulfilmentOptions {
	const fulfilmentInUrl = getQueryParameter('fulfilment');
	return fulfilmentInUrl === 'HomeDelivery' ? HomeDelivery : Collection;
}

function getDays(
	fulfilmentOption: FulfilmentOptions,
	productOption: ProductOptions,
): Date[] {
	return fulfilmentOption === HomeDelivery
		? getHomeDeliveryDays(Date.now(), productOption)
		: getVoucherDays(Date.now(), productOption);
}

const getStartDate = (
	fulfilmentOption: FulfilmentOptions,
	productOption: ProductOptions,
): string | null =>
	formatMachineDate(getDays(fulfilmentOption, productOption)[0]) || null;

export { getProductOption, getFulfilmentOption, getDays, getStartDate };
