import type { CurrencyInfo } from '@modules/internationalisation/currency';
import type { TaxRateResult } from 'helpers/salesTax/getEstimatedSalesTaxRate';
import { MaybeEstimatedTax } from './maybeEstimatedTax';

type Props = {
	amount: number;
	taxRateResult: TaxRateResult;
	currency: CurrencyInfo;
};

export function MaybeEstimatedTaxSummary({
	currency,
	amount,
	taxRateResult,
}: Props) {
	switch (taxRateResult.type) {
		case 'tax_inclusive':
			return null;
		case 'not_enough_information':
		case 'tax_exclusive':
			return (
				<MaybeEstimatedTax
					amount={amount}
					taxRateResult={taxRateResult}
					currency={currency}
				/>
			);
	}
}
