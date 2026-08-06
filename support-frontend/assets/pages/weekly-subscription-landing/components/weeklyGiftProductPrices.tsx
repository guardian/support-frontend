import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { weeklyGiftBillingPeriods } from 'helpers/productPrice/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getWeeklyProducts } from '../helpers/getWeeklyProducts';
import Prices from './content/prices';

function WeeklyGiftProductPrices({
	countryId,
	supportRegionId,
	productPrices,
}: {
	countryId: CountryCode;
	supportRegionId: SupportRegionId;
	productPrices: ProductPrices;
}): JSX.Element | null {
	const products = getWeeklyProducts({
		countryId,
		productPrices,
		billingPeriods: weeklyGiftBillingPeriods,
		isGift: true,
	});
	return <Prices supportRegionId={supportRegionId} products={products} />;
}

export default WeeklyGiftProductPrices;
