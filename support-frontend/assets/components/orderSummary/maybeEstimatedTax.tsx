import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { CurrencyInfo } from '@modules/internationalisation/currency';
import { simpleFormatTaxAmount } from 'helpers/forms/checkouts';
import type { TaxRateResult } from 'helpers/salesTax/getEstimatedSalesTaxRate';

type Props = {
	amount: number;
	taxRateResult: TaxRateResult;
	currency: CurrencyInfo;
};

// TODO: these are duplicated from ContributionsOrderSummary
const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 4px 0 8px 0;
`;

const rowSpacing = css`
	&:not(:last-child) {
		margin-bottom: ${space[5]}px;

		${from.desktop} {
			margin-bottom: ${space[6]}px;
		}
	}
`;

export function MaybeEstimatedTax({ currency, amount, taxRateResult }: Props) {
	switch (taxRateResult.type) {
		case 'tax_inclusive':
			return null;
		case 'not_enough_information':
			return (
				<div css={[summaryRow, rowSpacing]}>
					<p>Estimated tax</p>
					<p>Calculated with province</p>
				</div>
			);
		case 'tax_exclusive':
			return (
				<div css={[summaryRow, rowSpacing]}>
					<p>Estimated tax</p>
					<p>{simpleFormatTaxAmount(currency, amount, taxRateResult.rate)}</p>
				</div>
			);
	}
}
