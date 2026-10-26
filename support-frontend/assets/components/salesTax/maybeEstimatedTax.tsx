import { css } from '@emotion/react';
import type { Currency } from '@modules/internationalisation/currency';
import type { ReactNode } from 'react';
import type { Payment } from 'helpers/forms/checkouts';
import { simpleFormatTaxAmount } from 'helpers/forms/checkouts';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';

type Props = {
	payment: Payment;
	taxRateConfig: TaxRateConfig;
	currency: Currency;
	children?: ReactNode;
};

const rowContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`;

export function MaybeEstimatedTax({
	payment,
	currency,
	taxRateConfig,
	children,
}: Props) {
	switch (taxRateConfig.type) {
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
						<p>
							{simpleFormatTaxAmount(currency, payment, taxRateConfig.rate)}
						</p>
					</div>
					{children}
				</>
			);
	}
}
