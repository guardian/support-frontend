import { z } from 'zod';

export const currencySchema = z.union([
	z.literal('GBP'),
	z.literal('EUR'),
	z.literal('USD'),
	z.literal('CAD'),
	z.literal('AUD'),
	z.literal('NZD'),
]);
export type Currency = z.infer<typeof currencySchema>;
