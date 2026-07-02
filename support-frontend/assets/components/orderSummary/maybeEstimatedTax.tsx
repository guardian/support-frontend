import { css } from '@emotion/react';
import { neutral, space, textSans12 } from '@guardian/source/foundations';
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
`;

const tsAndCsContainer = css`
	padding: ${space[3]}px 0 0 0;
`;

const tsAndCsText = css`
	${textSans12};
	color: ${neutral[38]};
`;

function TaxTsAndCs() {
	return (
		<div css={tsAndCsContainer}>
			<p css={tsAndCsText}>
				Tax is calculated based on your province and, if applicable, will be
				applied at the point of payment.
			</p>
		</div>
	);
}

export function MaybeEstimatedTax({ currency, amount, taxRateResult }: Props) {
	switch (taxRateResult.type) {
		case 'tax_inclusive':
			return null;
		case 'not_enough_information':
			return (
				<>
					<div css={summaryRow}>
						<p>Estimated tax</p>
						<p>Calculated with province</p>
					</div>
					<TaxTsAndCs />
				</>
			);
		case 'tax_exclusive':
			return (
				<>
					<div css={summaryRow}>
						<p>Estimated tax</p>
						<p>{simpleFormatTaxAmount(currency, amount, taxRateResult.rate)}</p>
					</div>
					<TaxTsAndCs />
				</>
			);
	}
}
