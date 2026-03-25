import type { IsoCountry } from '@modules/internationalisation/country';
import { weeklyGiftBillingPeriods } from 'helpers/productPrice/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getWeeklyGiftProduct } from '../helpers/getWeeklyProducts';
import Prices from './content/prices';

function WeeklyGiftProductPrices({
	countryId,
	productPrices,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
}): JSX.Element | null {
	const products = getWeeklyGiftProduct({
		countryId,
		productPrices,
		billingPeriods: weeklyGiftBillingPeriods,
	});
	return <Prices products={products} />;
}

export default WeeklyGiftProductPrices;
