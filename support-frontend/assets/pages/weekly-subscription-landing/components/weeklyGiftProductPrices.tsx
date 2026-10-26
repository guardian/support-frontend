import type { CountryCode } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { weeklyGiftBillingPeriods } from 'helpers/productPrice/billingPeriods';
import { getWeeklyProducts } from '../helpers/getWeeklyProducts';
import Prices from './content/prices';

function WeeklyGiftProductPrices({
	countryId,
	countryGroupId,
	productCatalog,
	promotions,
	promoCode,
}: {
	countryId: CountryCode;
	countryGroupId: CountryGroupId;
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
}): JSX.Element | null {
	const products = getWeeklyProducts({
		countryId,
		countryGroupId,
		productCatalog,
		promotions,
		promoCode,
		billingPeriods: weeklyGiftBillingPeriods,
		isGift: true,
	});
	return <Prices countryGroupId={countryGroupId} products={products} />;
}

export default WeeklyGiftProductPrices;
