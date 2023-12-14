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
import * as storage from 'helpers/storage/storage';
import type { DateYMDString } from 'helpers/types/DateString';
import { getQueryParameter } from 'helpers/urls/url';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getVoucherDays } from 'pages/paper-subscription-checkout/helpers/voucherDeliveryDays';

function getProductOption(): PaperProductOptions {
	const PRODUCT_STORAGE_KEY = 'selectedProduct'; // create the key for product in session storage
	const productInUrl = getQueryParameter('product'); // get product from Query |Params
	const productInSessionStorage = storage.getSession(PRODUCT_STORAGE_KEY); // get product from Session Storage
	const productInUrlOrSessionStorage = productInUrl
		? productInUrl
		: productInSessionStorage; // get the value from url or session storage(whichever is available)
	if (productInUrl) {
		storage.setSession(PRODUCT_STORAGE_KEY, productInUrl); // always set product in session storage if  there is a value in the url
	}
	return (
		ActivePaperProductTypes.find(
			(product) => product === productInUrlOrSessionStorage,
		) ?? Everyday
	);
}

function getFulfilmentOption(): PaperFulfilmentOptions {
	const FULFILMENT_STORAGE_KEY = 'selectedFulfilment';
	const fulfilmentInUrl = getQueryParameter('fulfilment');
	const fulfilmentInSessionStorage = storage.getSession(FULFILMENT_STORAGE_KEY);
	const fulfilmentInUrlOrSessionStorage = fulfilmentInUrl
		? fulfilmentInUrl
		: fulfilmentInSessionStorage;
	if (fulfilmentInUrl) {
		storage.setSession(FULFILMENT_STORAGE_KEY, fulfilmentInUrl);
	}
	return fulfilmentInUrlOrSessionStorage === 'HomeDelivery'
		? HomeDelivery
		: Collection;
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
): DateYMDString =>
	formatMachineDate(getDays(fulfilmentOption, productOption)[0]);

export { getProductOption, getFulfilmentOption, getDays, getStartDate };
