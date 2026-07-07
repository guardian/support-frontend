import { css } from '@emotion/react';
import type { CurrencyInfo } from '@modules/internationalisation/currency';
import type { ReactNode } from 'react';
import { simpleFormatTaxAmount } from 'helpers/forms/checkouts';
import type { TaxRateResult } from 'helpers/salesTax/getEstimatedSalesTaxRate';

type Props = {
	amount: number;
	taxRateResult: TaxRateResult;
	currency: CurrencyInfo;
	children?: ReactNode;
};

const rowContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding-top: 4px;
`;

export function MaybeEstimatedTax({
	currency,
	amount,
	taxRateResult,
	children,
}: Props) {
	switch (taxRateResult.type) {
		case 'tax_inclusive':
			return null;
		case 'not_enough_information':
			return (
				<>
					<div css={rowContainer}>
						<p>Estimated tax</p>
						<p>Calculated with province</p>
					</div>
					{children}
				</>
			);
		case 'tax_exclusive':
			return (
				<>
					<div css={rowContainer}>
						<p>Estimated tax</p>
						<p>{simpleFormatTaxAmount(currency, amount, taxRateResult.rate)}</p>
					</div>
					{children}
				</>
			);
	}
}
