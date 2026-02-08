// describes options relating to a product itself - only relevant for paper currently

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
	| typeof NewspaperArchive;

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
};
