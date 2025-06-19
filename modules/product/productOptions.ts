// describes options relating to a product itself - only relevant for paper currently
import { z } from 'zod';

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

export const productOptionsSchema = z.enum([
	NoProductOptions,
	Everyday,
	EverydayPlus,
	Sixday,
	SixdayPlus,
	Weekend,
	WeekendPlus,
	Saturday,
	SaturdayPlus,
	Sunday,
	SundayPlus,
	NewspaperArchive,
]);

export type ProductOptions = z.infer<typeof productOptionsSchema>;

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
	NewspaperArchive,
};
