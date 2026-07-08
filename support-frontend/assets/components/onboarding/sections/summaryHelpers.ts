import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import {
	simpleFormatAmount,
	simpleFormatTaxAmount,
} from 'helpers/forms/checkouts';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

export function getTodaysPaymentWithTaxExclusion(
	finalAmount: number,
	currencyKey: IsoCurrency,
	taxConfig: TaxRateConfig | undefined,
): string | undefined {
	if (!taxConfig || taxConfig.type !== 'tax_exclusive') {
		return;
	}

	const finalAmountWithCurrency = simpleFormatAmount(
		getCurrencyInfo(currencyKey),
		finalAmount,
	);

	const taxAmountWithCurrency = simpleFormatTaxAmount(
		getCurrencyInfo(currencyKey),
		finalAmount,
		taxConfig.rate,
	);

	return `${finalAmountWithCurrency} + ${taxAmountWithCurrency} estimated tax`;
}
