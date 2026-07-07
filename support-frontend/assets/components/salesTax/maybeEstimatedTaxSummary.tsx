import { css } from '@emotion/react';
import { from, space, textSans17 } from '@guardian/source/foundations';
import type { CurrencyInfo } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import {
	calculateTax,
	roundAmount,
	roundTaxAmount,
	simpleFormatAmount,
} from 'helpers/forms/checkouts';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxRate';
import { PriceSummary } from '../priceSummary/priceSummary';
import { MaybeEstimatedTax } from './maybeEstimatedTax';

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding-top: 4px;
`;

const taxSummaryContainer = css`
	${textSans17}
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
	taxRateConfig: TaxRateConfig;
	currency: CurrencyInfo;
	billingPeriod: BillingPeriod;
	fullPrice: string;
	discountPrice: string | undefined;
};

function calculateAndFormatTotal(
	taxRateConfig: TaxRateConfig,
	currency: CurrencyInfo,
	amount: number,
): string {
	switch (taxRateConfig.type) {
		case 'tax_inclusive':
		case 'not_enough_information':
			return simpleFormatAmount(currency, amount);
		case 'tax_exclusive': {
			// It's important that the rounding here reflects the individual amounts
			// otherwise we may show the user a calculation which doens't add up:

			// Amounts are rounded the usual way:
			const roundedTotal = roundAmount(amount);

			// Tax amounts are rounded down:
			const roundedDownTaxAmount = roundTaxAmount(
				calculateTax(amount, taxRateConfig.rate),
			);

			return simpleFormatAmount(currency, roundedTotal + roundedDownTaxAmount);
		}
	}
}

export function MaybeEstimatedTaxSummary({
	currency,
	amount,
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
						/>
					</div>
					<MaybeEstimatedTax
						amount={amount}
						taxRateConfig={taxRateConfig}
						currency={currency}
					/>
					<div css={[summaryRow, boldText]}>
						<p>Due today</p>
						<p>{calculateAndFormatTotal(taxRateConfig, currency, amount)}</p>
					</div>
				</div>
			);
		}
	}
}
