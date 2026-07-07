import { css } from '@emotion/react';
import { from, palette, space, textSans17 } from '@guardian/source/foundations';
import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { PriceSummary } from 'components/priceSummary/priceSummary';
import { MaybeEstimatedTax } from 'components/salesTax/maybeEstimatedTax';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { TaxRateConfig } from 'helpers/salesTax/getEstimatedSalesTaxConfig';
import type { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import { TaxTsAndCs } from './taxTsAndCs';

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding-top: ${space[1]}px;
`;

const rowSpacing = css`
	&:not(:last-child) {
		margin-bottom: ${space[5]}px;

		${from.desktop} {
			margin-bottom: ${space[6]}px;
		}
	}
`;

const boldText = css`
	font-weight: 700;
`;

const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: 0;
`;

const savingTextCss = css`
	color: ${palette.lifestyle[400]};
	${textSans17};
	margin-top: ${space[1]}px;
`;

const weeklyPricingSummary = css`
	display: flex;
	flex-direction: column;
	gap: ${space[1]}px;
	margin-bottom: ${space[5]}px;
	padding: ${space[1]}px 0;

	& div {
		padding: 0;
	}
`;

type PriceBreakdownProps = {
	weeklyPrice?: string;
	fullPrice: string;
	discountPrice?: string;
	savingText: string | null;
	isWeeklyGift: boolean;
	currency: CurrencyInfo;
	amount: number;
	taxRateConfig: TaxRateConfig;
	studentDiscount?: StudentDiscount;
	billingPeriod: BillingPeriod;
};

export function PriceBreakdown({
	weeklyPrice,
	fullPrice,
	discountPrice,
	savingText,
	isWeeklyGift,
	currency,
	amount,
	taxRateConfig,
	billingPeriod,
	studentDiscount,
}: PriceBreakdownProps): JSX.Element {
	const paymentFrequency = getBillingPeriodNoun(billingPeriod, isWeeklyGift);
	const period = studentDiscount?.periodNoun ?? paymentFrequency;

	// Ignore tax calculation for weekly pricing, we'll revisit this if
	// we want to show weekly prices for tax exclusive rate plans in Canada
	if (weeklyPrice) {
		return (
			<div css={weeklyPricingSummary}>
				<div css={summaryRow}>
					<p>Weekly price</p>
					<p>{weeklyPrice}</p>
				</div>
				<div css={[summaryRow, boldText]}>
					<p>Total due every {period}</p>
					<p>{discountPrice ?? fullPrice}</p>
				</div>
				{savingText && (
					<div>
						<hr css={hrCss} />
						<p css={savingTextCss}>{savingText}</p>
					</div>
				)}
			</div>
		);
	}

	// When the tax is shown separately the label is e.g. "Monthly price"
	const priceLabel =
		taxRateConfig.type === 'tax_inclusive' ? 'Total' : `${billingPeriod} price`;

	return (
		<>
			<div css={[rowSpacing]}>
				<div css={[summaryRow, boldText]}>
					<p>{priceLabel}</p>
					<PriceSummary
						fullPrice={fullPrice}
						period={period}
						discountPrice={discountPrice}
						isWeeklyGift={isWeeklyGift}
					/>
				</div>
				<MaybeEstimatedTax
					currency={currency}
					// The amount to use for tax calculations. This is the discounted price
					// when a promotion applies, otherwise the full amount. This doesn't handle
					// student discounts currently because they're never tax exclusive, but if
					// this changes we'll need to revisit this amount prop.
					amount={amount}
					taxRateConfig={taxRateConfig}
				>
					<TaxTsAndCs />
				</MaybeEstimatedTax>
			</div>
		</>
	);
}
