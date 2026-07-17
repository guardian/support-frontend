import { z } from 'zod';
import { dateOrDateStringSchema } from './stateSchemas';

export type InvoiceItem = {
	serviceStartDate: Date;
	amountWithoutTax: number;
	taxAmount: number;
};

const paymentSchema = z.object({
	date: dateOrDateStringSchema,
	amount: z.number(),
	amountWithoutTax: z.number().optional(),
	taxAmount: z.number().optional(),
});
export type Payment = z.infer<typeof paymentSchema>;

export const paymentScheduleSchema = z.object({
	payments: z.array(paymentSchema),
});
export type PaymentSchedule = z.infer<typeof paymentScheduleSchema>;

const round = (amount: number): number => Math.round(amount * 100) / 100;

export const buildPaymentSchedule = (
	invoiceItems: InvoiceItem[],
): PaymentSchedule => {
	if (invoiceItems.length == 0) {
		throw new Error('No invoice items provided to buildPaymentSchedule');
	}
	const paymentMap = new Map<
		string,
		{ amountWithoutTax: number; taxAmount: number }
	>();

	for (const charge of invoiceItems) {
		const dateKey = charge.serviceStartDate.toISOString();
		const current = paymentMap.get(dateKey) ?? {
			amountWithoutTax: 0,
			taxAmount: 0,
		};
		paymentMap.set(dateKey, {
			amountWithoutTax: current.amountWithoutTax + charge.amountWithoutTax,
			taxAmount: current.taxAmount + charge.taxAmount,
		});
	}

	const payments: Payment[] = [];
	for (const [dateKey, { amountWithoutTax, taxAmount }] of paymentMap) {
		payments.push({
			date: new Date(dateKey),
			amount: round(amountWithoutTax + taxAmount),
			amountWithoutTax: amountWithoutTax,
			taxAmount: taxAmount,
		});
	}

	payments.sort((a, b) => a.date.getTime() - b.date.getTime());
	return { payments };
};
