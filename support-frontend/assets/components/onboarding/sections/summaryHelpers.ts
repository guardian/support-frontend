import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { OrderSchemaType } from 'pages/[countryGroupId]/checkout/helpers/sessionStorage';

export function getTodaysPaymentWithTaxExclusion(
	finalAmount: number,
	currencyKey: IsoCurrency,
	taxConfig: OrderSchemaType['taxConfig'] | undefined,
): string | undefined {
	if (!taxConfig || taxConfig.type !== 'tax_exclusive') {
		return;
	}

	const finalAmountWithCurrency = simpleFormatAmount(
		getCurrencyInfo(currencyKey),
		finalAmount,
	);

	const taxAmountWithCurrency = simpleFormatAmount(
		getCurrencyInfo(currencyKey),
		finalAmount * taxConfig.rate,
	);

	return `${finalAmountWithCurrency} + ${taxAmountWithCurrency} estimated tax`;
}
