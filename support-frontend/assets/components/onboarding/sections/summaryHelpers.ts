import type { CurrencyCode } from '@modules/internationalisation/currency';
import { getCurrencyByCode } from '@modules/internationalisation/currency';
import type { Payment } from 'helpers/forms/checkouts';
import {
	simpleFormatAmount,
	simpleFormatTaxAmount,
} from 'helpers/forms/checkouts';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

export function getTodaysPaymentWithTaxExclusion(
	payment: Payment,
	currencyKey: CurrencyCode,
	taxConfig: TaxRateConfig | undefined,
): string | undefined {
	if (!taxConfig || taxConfig.type !== 'tax_exclusive') {
		return;
	}

	const { finalAmount } = payment;

	const finalAmountWithCurrency = simpleFormatAmount(
		getCurrencyByCode(currencyKey),
		finalAmount,
	);

	const taxAmountWithCurrency = simpleFormatTaxAmount(
		getCurrencyByCode(currencyKey),
		payment,
		taxConfig.rate,
	);

	return `${finalAmountWithCurrency} + ${taxAmountWithCurrency} estimated tax`;
}
