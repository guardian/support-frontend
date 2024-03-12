import { css } from '@emotion/react';
import { palette, textSans } from '@guardian/source-foundations';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import type { TierPlanCosts } from '../setup/threeTierConfig';

interface ThreeTierDisclaimerProps {
	planCost: TierPlanCosts;
	currency: string;
}

interface ToteTsAndCsProps {
	currency: string;
	toteCostMonthly: number;
	toteCostAnnual: number;
}

const container = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${textSans.xxsmall({ lineHeight: 'tight' })};
`;

const discountSummaryCopy = (currency: string, planCost: TierPlanCosts) => {
	// EXAMPLE: £16/month for the first 12 months, then £25/month
	if (planCost.discount) {
		const duration = planCost.discount.duration.value;
		const period = planCost.discount.duration.period;
		return `${currency}${planCost.discount.price}/${
			recurringContributionPeriodMap[planCost.discount.duration.period]
		} for the first ${duration > 1 ? duration : ''} ${
			recurringContributionPeriodMap[period]
		}${duration > 1 ? 's' : ''}, then ${currency}${planCost.price}/${
			recurringContributionPeriodMap[planCost.discount.duration.period]
		}`;
	}
};

export function ThreeTierDisclaimer({
	planCost,
	currency,
}: ThreeTierDisclaimerProps): JSX.Element {
	return (
		<>
			{!!planCost.discount && (
				<div css={container}>
					<p>
						*Digital + Print offer is {discountSummaryCopy(currency, planCost)}{' '}
						afterwards unless you cancel.
					</p>
					<p>
						Offer only available to new subscribers who do not have an existing
						subscription with the Guardian.
					</p>
				</div>
			)}
		</>
	);
}

export function ToteTsAndCs({
	currency,
	toteCostMonthly,
	toteCostAnnual,
}: ToteTsAndCsProps): JSX.Element {
	return (
		<div css={container}>
			<p>
				**Tote bags are only available for qualified new recurring supporters
				(monthly: {currency}
				{toteCostMonthly} or more; annual: {currency}
				{toteCostAnnual} or more) on a first come, first served basis while
				supplies last. Limit one per customer. Distribution to US and
				APO/FPO/DPO addresses only. Please allow 2-4 weeks for shipping.
			</p>
		</div>
	);
}
