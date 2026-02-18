import type { IsoCountry } from '@modules/internationalisation/country';
import {
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProducts } from '../helpers/getWeeklyProducts';
import Prices from './content/prices';

function WeeklyProductPrices({
	countryId,
	productPrices,
	orderIsAGift,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
	orderIsAGift: boolean;
}): JSX.Element | null {
	const billingPeriods = orderIsAGift
		? weeklyGiftBillingPeriods
		: weeklyBillingPeriods;

	const products = getProducts({
		countryId,
		productPrices,
		billingPeriods,
		orderIsAGift,
	});

	return <Prices products={products} orderIsAGift={orderIsAGift} />;
}

// ----- Exports ----- //

export default WeeklyProductPrices;
