// describes options relating to a product itself - only relevant for paper currently
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const NoProductOptions = 'NoProductOptions';
const Saturday = 'Saturday';
const SaturdayPlus = 'SaturdayPlus';
const Sunday = 'Sunday';
const SundayPlus = 'SundayPlus';
const Weekend = 'Weekend';
const WeekendPlus = 'WeekendPlus';
const Sixday = 'Sixday';
const SixdayPlus = 'SixdayPlus';
const Everyday = 'Everyday';
const EverydayPlus = 'EverydayPlus';
const NewspaperArchive = 'NewspaperArchive';

export type ProductOptions =
	| typeof NoProductOptions
	| typeof Saturday
	| typeof SaturdayPlus
	| typeof Sunday
	| typeof SundayPlus
	| typeof Weekend
	| typeof WeekendPlus
	| typeof Sixday
	| typeof SixdayPlus
	| typeof Everyday
	| typeof EverydayPlus
	| typeof NewspaperArchive;

export type PaperProductOptions =
	| typeof Saturday
	| typeof Sunday
	| typeof Weekend
	| typeof Sixday
	| typeof Everyday
	| typeof SaturdayPlus
	| typeof SundayPlus
	| typeof WeekendPlus
	| typeof SixdayPlus
	| typeof EverydayPlus;

const ActivePaperProductTypes: readonly PaperProductOptions[] = [
	Everyday,
	Sixday,
	Weekend,
	Saturday,
	Sunday,
	EverydayPlus,
	SixdayPlus,
	WeekendPlus,
	SaturdayPlus,
	SundayPlus,
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
	Sunday: SundayPlus,
	Weekend: WeekendPlus,
	Sixday: SixdayPlus,
	Everyday: EverydayPlus,
} as Record<ProductOptions, ProductOptions>;

const paperProductsWithoutDigital = {
	SaturdayPlus: Saturday,
	SundayPlus: Sunday,
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
		case 'SundayPlus':
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
	NoProductOptions,
	Saturday,
	SaturdayPlus,
	Sunday,
	SundayPlus,
	Weekend,
	WeekendPlus,
	Sixday,
	SixdayPlus,
	Everyday,
	EverydayPlus,
	ActivePaperProductTypes,
	paperProductsWithDigital,
	paperProductsWithoutDigital,
	productOptionIfDigiAddOnChanged,
};
