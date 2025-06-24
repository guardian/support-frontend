import { z } from 'zod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	Collection,
	Domestic,
	HomeDelivery,
	NationalDelivery,
	NoFulfilmentOptions,
	RestOfWorld,
} from '@modules/product/fulfilmentOptions';
import {
	Everyday,
	EverydayPlus,
	NewspaperArchive,
	NoProductOptions,
	Saturday,
	SaturdayPlus,
	Sixday,
	SixdayPlus,
	Sunday,
	Weekend,
	WeekendPlus,
} from '@modules/product/productOptions';

export const billingPeriodSchema = z.nativeEnum(BillingPeriod);

export const recurringBillingPeriodSchema = z.union([
	z.literal(BillingPeriod.Annual),
	z.literal(BillingPeriod.Monthly),
	z.literal(BillingPeriod.Quarterly),
]);

export const fulfilmentOptionsSchema = z.enum([
	NoFulfilmentOptions,
	NationalDelivery,
	HomeDelivery,
	Collection,
	Domestic,
	RestOfWorld,
]);
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
	NewspaperArchive,
]);
