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
	Weekend,
	WeekendPlus,
} from '@modules/product/productOptions';
import type { ActiveProductKey, ActiveRatePlanKey } from './productCatalog';

const ActivePaperProductTypes: readonly PaperProductOptions[] = [
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
export const isActivePaperProductOption = (
	productOption: ProductOptions,
): productOption is ActivePaperProductOptions => {
	return ActivePaperProductTypes.includes(
		productOption as ActivePaperProductOptions,
	);
};
const paperProductsWithDigital = {
	Saturday: SaturdayPlus,
	Weekend: WeekendPlus,
	Sixday: SixdayPlus,
	Everyday: EverydayPlus,
} as Record<ProductOptions, ProductOptions>;
const paperProductsWithoutDigital = {
	SaturdayPlus: Saturday,
	WeekendPlus: Weekend,
	SixdayPlus: Sixday,
	EverydayPlus: Everyday,
} as Record<ProductOptions, ProductOptions>;
// Returns the product option with the opposite 'add digital' option to the one passed
// e.g. SaturdayPlus -> Saturday
function productOptionIfDigiAddOnChanged(
	selectedOption: ProductOptions,
): ProductOptions {
	if (selectedOption === 'NoProductOptions') {
		return selectedOption;
	}
	const matchingProducLookup = {
		...paperProductsWithDigital,
		...paperProductsWithoutDigital,
	};
	return matchingProducLookup[selectedOption];
}

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
export const getProductOptionFromProductAndRatePlan = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): ProductOptions => {
	switch (productKey) {
		case 'SupporterPlus':
		case 'GuardianAdLite':
		case 'Contribution':
		case 'OneTimeContribution':
		case 'DigitalSubscription':
		case 'GuardianWeeklyRestOfWorld':
		case 'GuardianWeeklyDomestic':
			return 'NoProductOptions';
		case 'TierThree':
			return ratePlanKey.endsWith('V2')
				? 'NewspaperArchive'
				: 'NoProductOptions';
		case 'SubscriptionCard':
		case 'NationalDelivery':
		case 'HomeDelivery':
			return getPaperProductOptions(ratePlanKey);
	}
};
export {
	productOptionIfDigiAddOnChanged,
	paperProductsWithoutDigital,
	paperProductsWithDigital,
	ActivePaperProductTypes,
};
