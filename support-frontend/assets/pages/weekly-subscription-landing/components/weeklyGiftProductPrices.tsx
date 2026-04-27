import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { weeklyGiftBillingPeriods } from 'helpers/productPrice/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getWeeklyProducts } from '../helpers/getWeeklyProducts';
import Prices from './content/prices';

function WeeklyGiftProductPrices({
	countryId,
	countryGroupId,
	productPrices,
}: {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices;
}): JSX.Element | null {
	const products = getWeeklyProducts({
		countryId,
		productPrices,
		billingPeriods: weeklyGiftBillingPeriods,
		isGift: true,
	});
	return <Prices countryGroupId={countryGroupId} products={products} />;
}

export default WeeklyGiftProductPrices;
