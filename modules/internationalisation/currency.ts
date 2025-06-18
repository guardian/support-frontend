import { z } from 'zod';

export const isoCurrencySchema = z.union([
	z.literal('GBP'),
	z.literal('EUR'),
	z.literal('USD'),
	z.literal('CAD'),
	z.literal('AUD'),
	z.literal('NZD'),
]);
export type IsoCurrency = z.infer<typeof isoCurrencySchema>;
