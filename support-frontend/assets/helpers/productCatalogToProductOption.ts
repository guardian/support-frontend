import type {
	PaperProductOptions,
	ProductOptions,
} from '@modules/product/productOptions';
import {
	Everyday,
	EverydayPlus,
	Saturday,
	SaturdayPlus,
	Sixday,
	SixdayPlus,
	Sunday,
	TaxExclusive,
	TaxInclusive,
	Weekend,
	WeekendPlus,
} from '@modules/product/productOptions';
import { isGuardianWeeklyDigitalProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import type { ActiveProductKey, ActiveRatePlanKey } from './productCatalog';

const ActivePaperProductTypes: PaperProductOptions[] = [
	SixdayPlus,
	SaturdayPlus,
	EverydayPlus,
	WeekendPlus,
	Everyday,
	Sixday,
	Weekend,
	Saturday,
	Sunday,
] as const;
export type ActivePaperProductOptions =
	(typeof ActivePaperProductTypes)[number];

const getPaperProductOptions = (
	ratePlanKey: ActiveRatePlanKey,
): ProductOptions => {
	switch (ratePlanKey) {
		case 'Saturday':
		case 'Sunday':
		case 'Weekend':
		case 'Sixday':
		case 'Everyday':
		case 'WeekendPlus':
		case 'SaturdayPlus':
		case 'SixdayPlus':
		case 'EverydayPlus':
			return ratePlanKey;
	}
	throw new Error(
		`Paper product option not defined for ratePlan ${ratePlanKey}`,
	);
};
const getTaxRelatedProductOption = (ratePlanKey: ActiveRatePlanKey) => {
	switch (ratePlanKey) {
		case 'MonthlyTaxExclusive':
		case 'AnnualTaxExclusive':
			return TaxExclusive;
	}
	return TaxInclusive;
};
export const getProductOptionFromProductAndRatePlan = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): ProductOptions => {
	switch (productKey) {
		case 'GuardianAdLite':
		case 'Contribution':
		case 'OneTimeContribution':
			return 'NoProductOptions';
		case 'SupporterPlus':
		case 'DigitalSubscription':
			return getTaxRelatedProductOption(ratePlanKey);
		case 'GuardianWeeklyRestOfWorld':
		case 'GuardianWeeklyDomestic':
			return isGuardianWeeklyDigitalProduct(productKey, ratePlanKey)
				? 'PlusDigital'
				: 'NoProductOptions';
		case 'SubscriptionCard':
		case 'NationalDelivery':
		case 'HomeDelivery':
			return getPaperProductOptions(ratePlanKey);
	}
};
export { ActivePaperProductTypes };
