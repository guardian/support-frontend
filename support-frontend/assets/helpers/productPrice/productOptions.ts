// describes options relating to a product itself - only relevant for paper currently
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
	| typeof EverydayPlus;

export type PaperProductOptions =
	| typeof Saturday
	| typeof Sunday
	| typeof Weekend
	| typeof Sixday
	| typeof Everyday;

export type PaperAndDigitalProductOptions =
	| typeof SaturdayPlus
	| typeof SundayPlus
	| typeof WeekendPlus
	| typeof SixdayPlus
	| typeof EverydayPlus;

const ActivePaperProductTypes: PaperProductOptions[] = [
	Everyday,
	Sixday,
	Weekend,
	Saturday,
	Sunday,
];

export type ActivePaperProducts =
	| typeof Sunday
	| typeof SundayPlus
	| typeof Weekend
	| typeof WeekendPlus
	| typeof Sixday
	| typeof SixdayPlus
	| typeof Everyday
	| typeof EverydayPlus;

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
};
