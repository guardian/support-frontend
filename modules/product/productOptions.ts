// describes options relating to a product itself - only relevant for paper currently

import { SupportRegionId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import type { ProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';

const NoProductOptions = 'NoProductOptions';
const Saturday = 'Saturday';
const SaturdayPlus = 'SaturdayPlus';
const Sunday = 'Sunday';
const Weekend = 'Weekend';
const WeekendPlus = 'WeekendPlus';
const Sixday = 'Sixday';
const SixdayPlus = 'SixdayPlus';
const Everyday = 'Everyday';
const EverydayPlus = 'EverydayPlus';
const NewspaperArchive = 'NewspaperArchive';
const TaxInclusive = 'TaxInclusive';
const TaxExclusive = 'TaxExclusive';
const PlusDigital = 'PlusDigital';

export type ProductOptions =
	| typeof NoProductOptions
	| typeof Saturday
	| typeof SaturdayPlus
	| typeof Sunday
	| typeof Weekend
	| typeof WeekendPlus
	| typeof Sixday
	| typeof SixdayPlus
	| typeof Everyday
	| typeof EverydayPlus
	| typeof NewspaperArchive
	| typeof TaxInclusive
	| typeof TaxExclusive
	| typeof PlusDigital;

export type PaperProductOptions =
	| typeof Saturday
	| typeof Sunday
	| typeof Weekend
	| typeof Sixday
	| typeof Everyday
	| typeof SaturdayPlus
	| typeof WeekendPlus
	| typeof SixdayPlus
	| typeof EverydayPlus;

export type PrintProductOptions =
	| typeof NoProductOptions
	| typeof Saturday
	| typeof Sunday
	| typeof Weekend
	| typeof Sixday
	| typeof Everyday
	| typeof SaturdayPlus
	| typeof WeekendPlus
	| typeof SixdayPlus
	| typeof EverydayPlus;

export function getThreeTierProductOption(
	productKey: ProductKey,
	supportRegionId: SupportRegionId,
): ProductOptions {
	if (
		supportRegionId == SupportRegionId.CA &&
		(productKey === 'DigitalSubscription' || productKey === 'SupporterPlus')
	) {
		return TaxExclusive;
	}
	return TaxInclusive;
}

export {
	NoProductOptions,
	Saturday,
	SaturdayPlus,
	Sunday,
	Weekend,
	WeekendPlus,
	Sixday,
	SixdayPlus,
	Everyday,
	EverydayPlus,
	NewspaperArchive,
	TaxInclusive,
	TaxExclusive,
	PlusDigital,
};
