import type { InvoiceItem } from '../model/paymentSchedule';
import {
	buildPaymentSchedule,
	paymentScheduleSchema,
} from '../model/paymentSchedule';

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
					amountWithoutTax: 10.0,
					taxAmount: 2.0,
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
					amountWithoutTax: 15.0,
					taxAmount: 3.0,
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
					amountWithoutTax: 10.0,
					taxAmount: 2.0,
				},
				{
					date: new Date('2025-02-01'),
					amount: 18.0,
					amountWithoutTax: 15.0,
					taxAmount: 3.0,
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
				amountWithoutTax: 10.0,
				taxAmount: 2.0,
			},
			{
				date: new Date('2025-02-01'),
				amount: 18.0,
				amountWithoutTax: 15.0,
				taxAmount: 3.0,
			},
			{
				date: new Date('2025-03-01'),
				amount: 24.0,
				amountWithoutTax: 20.0,
				taxAmount: 4.0,
			},
		]);
	});

	test('should round the total amount to 2 decimal places', () => {
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
					amountWithoutTax: 10.333,
					taxAmount: 2.666,
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
					amountWithoutTax: 0,
					taxAmount: 0,
				},
			],
		});
	});
});

describe('paymentScheduleSchema', () => {
	it("ignores fields it doesn't know about", () => {
		const payments = {
			payments: [
				{
					date: new Date('2025-01-01'),
					amount: 10.0,
					amountWithoutTax: 8.0,
					taxAmount: 2.0,
					unexpectedField: 'hi',
				},
			],
		};

		const result = paymentScheduleSchema.safeParse(payments);

		expect(result.success).toEqual(true);
	});
});
