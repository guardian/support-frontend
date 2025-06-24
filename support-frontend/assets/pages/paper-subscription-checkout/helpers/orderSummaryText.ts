import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';

const productOptionDisplayNames = {
	Saturday: 'Saturday',
	SaturdayPlus: 'Saturday',
	Sunday: 'Sunday',
	Weekend: 'Weekend',
	WeekendPlus: 'Weekend',
	Sixday: 'Six day',
	SixdayPlus: 'Six day',
	Everyday: 'Every day',
	EverydayPlus: 'Every day',
	NewspaperArchive: 'Newspaper Archive',
};
export function getOrderSummaryTitle(
	productOption: ProductOptions,
	fulfilmentOption: FulfilmentOptions,
): string {
	const fulfilmentOptionDescriptor =
		fulfilmentOption === HomeDelivery ? 'Paper' : 'Subscription card';

	if (productOption === 'NoProductOptions') {
		return '';
	}

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
	return `${price}/${getBillingPeriodNoun(billingPeriod)}`;
}
