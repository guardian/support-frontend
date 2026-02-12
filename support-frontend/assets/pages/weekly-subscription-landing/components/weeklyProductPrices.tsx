import {
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import {
	getProducts,
	type WeeklyProductPricesProps,
} from '../helpers/getWeeklyProduct';
import Prices from './content/prices';

function WeeklyProductPrices({
	countryId,
	productPrices,
	orderIsAGift,
}: WeeklyProductPricesProps): JSX.Element | null {
	const billingPeriods = orderIsAGift
		? weeklyGiftBillingPeriods
		: weeklyBillingPeriods;

	const products = getProducts({
		countryId,
		productPrices,
		billingPeriods,
		orderIsAGift,
		enableWeeklyDigitalPlans,
	});
	return <Prices products={products} orderIsAGift={orderIsAGift} />;
}

// ----- Exports ----- //

export default WeeklyProductPrices;
