import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { Payment } from 'helpers/forms/checkouts';
import {
	simpleFormatAmount,
	simpleFormatTaxAmount,
} from 'helpers/forms/checkouts';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

export function getTodaysPaymentWithTaxExclusion(
	payment: Payment,
	currencyKey: IsoCurrency,
	taxConfig: TaxRateConfig | undefined,
): string | undefined {
	if (!taxConfig || taxConfig.type !== 'tax_exclusive') {
		return;
	}

	const { finalAmount } = payment;

	const finalAmountWithCurrency = simpleFormatAmount(
		getCurrencyInfo(currencyKey),
		finalAmount,
	);

	const taxAmountWithCurrency = simpleFormatTaxAmount(
		getCurrencyInfo(currencyKey),
		payment,
		taxConfig.rate,
	);

	return `${finalAmountWithCurrency} + ${taxAmountWithCurrency} estimated tax`;
}
