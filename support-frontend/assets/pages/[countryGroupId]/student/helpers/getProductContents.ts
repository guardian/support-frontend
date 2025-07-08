import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { productCatalog } from 'helpers/productCatalog';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';

export default function getProductContents(geoId: GeoId): CardContent {
	const { currencyKey } = getGeoIdConfig(geoId);
	const tier2Pricing = productCatalog.SupporterPlus?.ratePlans[
		BillingPeriod.Annual
	]?.pricing[currencyKey] as number;

	const urlSearchParams = new URLSearchParams({
		product: 'SupporterPlus',
		ratePlan: 'Annual',
		backButton: 'false',
	});

	const promotion = getPromotion(
		window.guardian.allProductPrices.SupporterPlus,
		geoId.toLocaleUpperCase() as IsoCountry,
		BillingPeriod.Annual,
	);
	const benefits = [
		{
			copy: 'Unlimited access to the Guardian app',
		},
		{
			copy: 'Unlimited access to the Guardian Feast app',
		},
		{
			copy: 'Ad-free reading on all your devices',
		},
		{
			copy: 'Exclusive supporter newsletter',
		},
		{
			copy: 'Far fewer asks for support',
		},
	];

	if (promotion) {
		urlSearchParams.set('promoCode', promotion.promoCode);
	}
	const chekoutUrl = `checkout?${urlSearchParams.toString()}`;
	return {
		product: 'SupporterPlus',
		price: tier2Pricing,
		link: chekoutUrl,
		promotion,
		isUserSelected: false,
		title: 'All-access digital',
		benefits,
		cta: {
			copy: 'Sign up for free',
		},
	};
}
