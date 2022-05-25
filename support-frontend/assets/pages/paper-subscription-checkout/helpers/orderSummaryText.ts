import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { billingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import 'helpers/productPrice/productPrices';

const productOptionDisplayNames = {
	Saturday: 'Saturday',
	SaturdayPlus: 'Saturday',
	Sunday: 'Sunday',
	SundayPlus: 'Sunday',
	Weekend: 'Weekend',
	WeekendPlus: 'Weekend',
	Sixday: 'Six day',
	SixdayPlus: 'Six day',
	Everyday: 'Every day',
	EverydayPlus: 'Every day',
};
export function getOrderSummaryTitle(
	productOption: ProductOptions,
	fulfilmentOption: FulfilmentOptions,
): string {
	const fulfilmentOptionDescriptor =
		fulfilmentOption === HomeDelivery ? 'Paper' : 'Subscription card';

	if (productOption === 'NoProductOptions') return '';

	return `${
		productOptionDisplayNames[productOption]
	} ${fulfilmentOptionDescriptor.toLowerCase()}`;
}

export function sensiblyGenerateDigiSubPrice(
	totalPrice: ProductPrice,
	paperPrice: ProductPrice,
): ProductPrice {
	const total = totalPrice.price;
	const paper = paperPrice.price;
	const digiSubPrice = (total * 100 - paper * 100) / 100;
	return { ...totalPrice, price: digiSubPrice };
}

export function getPriceSummary(
	price: string,
	billingPeriod: BillingPeriod,
): string {
	return `${price}/${billingPeriodNoun(billingPeriod).toLowerCase()}`;
}
