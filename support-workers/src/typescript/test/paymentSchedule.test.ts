import type { InvoiceItem } from '../model/paymentSchedule';
import { buildPaymentSchedule } from '../model/paymentSchedule';

describe('buildPaymentSchedule', () => {
	test('should throw if we have no invoice items', () => {
		expect(() => buildPaymentSchedule([])).toThrow(
			'No invoice items provided to buildPaymentSchedule',
		);
	});

	test('should create payment for single invoice item', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 10.0,
				taxAmount: 2.0,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result).toEqual({
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 12.0,
				},
			],
		});
	});

	test('should combine multiple invoice items with same date', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 10.0,
				taxAmount: 2.0,
			},
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 5.0,
				taxAmount: 1.0,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result).toEqual({
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 18.0,
				},
			],
		});
	});

	test('should create separate payments for different dates', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 10.0,
				taxAmount: 2.0,
			},
			{
				serviceStartDate: new Date('2025-02-01'),
				amountWithoutTax: 15.0,
				taxAmount: 3.0,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result).toEqual({
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 12.0,
				},
				{
					date: new Date('2025-02-01'),
					amount: 18.0,
				},
			],
		});
	});

	test('should sort payments by date ascending', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-03-01'),
				amountWithoutTax: 20.0,
				taxAmount: 4.0,
			},
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 10.0,
				taxAmount: 2.0,
			},
			{
				serviceStartDate: new Date('2025-02-01'),
				amountWithoutTax: 15.0,
				taxAmount: 3.0,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result.payments).toEqual([
			{
				date: new Date('2025-01-01'),
				amount: 12.0,
			},
			{
				date: new Date('2025-02-01'),
				amount: 18.0,
			},
			{
				date: new Date('2025-03-01'),
				amount: 24.0,
			},
		]);
	});

	test('should round amounts to 2 decimal places', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 10.333,
				taxAmount: 2.666,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result).toEqual({
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 13.0,
				},
			],
		});
	});

	test('should handle zero amounts', () => {
		const invoiceItems: InvoiceItem[] = [
			{
				serviceStartDate: new Date('2025-01-01'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
		];

		const result = buildPaymentSchedule(invoiceItems);

		expect(result).toEqual({
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 0,
				},
			],
		});
	});
	test('should handle paper subscriptions correctly', () => {
		const invoiceItems = [
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 5.68,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 5.68,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 11.01,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 7.46,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 8.39,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 5.68,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 0,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-01-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-02-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-03-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-04-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-05-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-06-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-07-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-08-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-09-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-10-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-11-12T00:00:00.000Z'),
				amountWithoutTax: 9.03,
				taxAmount: 0,
			},
			{
				serviceStartDate: new Date('2026-12-12T00:00:00.000Z'),
				amountWithoutTax: 6.12,
				taxAmount: 0,
			},
		];
		const result = buildPaymentSchedule(invoiceItems);

		expect(result.payments.length).toEqual(12);
	});
});
