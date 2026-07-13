import { css } from '@emotion/react';
import { from, space, textSans17 } from '@guardian/source/foundations';
import type { CurrencyInfo } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { calculateAndFormatTotal } from 'helpers/forms/checkouts';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';
import { PriceSummary } from '../priceSummary/priceSummary';
import { MaybeEstimatedTax } from './maybeEstimatedTax';

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`;

const taxSummaryContainer = css`
	${textSans17}
	display: flex;
	flex-direction: column;
	gap: ${space[1]}px;
	margin-top: ${space[6]}px;
	margin-bottom: ${space[5]}px;

	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const boldText = css`
	font-weight: 700;
`;

export type Props = {
	amount: number;
	amountExclDiscount: number;
	taxRateConfig: TaxRateConfig;
	currency: CurrencyInfo;
	billingPeriod: BillingPeriod;
	fullPrice: string;
	discountPrice: string | undefined;
};

export function MaybeEstimatedTaxSummary({
	currency,
	amount,
	amountExclDiscount,
	taxRateConfig,
	billingPeriod,
	fullPrice,
	discountPrice,
}: Props) {
	// Note: we'll have to revisit this if weekly gift is ever tax exclusive
	const isWeeklyGift = false;

	switch (taxRateConfig.type) {
		case 'tax_inclusive':
			return null;
		case 'not_enough_information':
		case 'tax_exclusive': {
			const paymentFrequency = getBillingPeriodNoun(
				billingPeriod,
				isWeeklyGift,
			);
			return (
				<div css={taxSummaryContainer}>
					<div css={[summaryRow]}>
						<p>{`${billingPeriod} price`}</p>
						<PriceSummary
							fullPrice={fullPrice}
							// Note: this doesn't handle student discount
							period={paymentFrequency}
							discountPrice={discountPrice}
							isWeeklyGift={isWeeklyGift}
							showPeriod={false}
						/>
					</div>
					<MaybeEstimatedTax
						amount={amount}
						taxRateConfig={taxRateConfig}
						currency={currency}
					/>
					<div css={[summaryRow, boldText]}>
						<p>Due today</p>
						<p>
							{calculateAndFormatTotal(
								taxRateConfig,
								currency,
								amount,
								amountExclDiscount,
							)}
						</p>
					</div>
				</div>
			);
		}
	}
}
