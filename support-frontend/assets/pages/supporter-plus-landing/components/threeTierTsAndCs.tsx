import { css } from '@emotion/react';
import { from, palette, textSans } from '@guardian/source-foundations';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import type { TierPlanCosts } from '../setup/threeTierConfig';

export interface TsAndCsProps {
	title: string;
	planCost: TierPlanCosts;
}

interface ThreeTierTsAndCsProps {
	tsAndCsContent: TsAndCsProps[];
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
	${from.desktop} {
		max-width: 780px;
	}
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

export function ThreeTierTsAndCs({
	tsAndCsContent,
	currency,
}: ThreeTierTsAndCsProps): JSX.Element {
	/*
  Each Ts&Cs is bound to a tierCard, a matching promoCount exists in threeTierCards
  therefore the '*' count can match between the promotion offer description & its
  associated Ts&Cs.
  */
	let promoCount = 0;
	return (
		<>
			{tsAndCsContent.map((tcContent) => {
				if (tcContent.planCost.discount) {
					promoCount++;
					return (
						<div css={container}>
							<p>
								{'*'.repeat(promoCount)} {tcContent.title} offer is{' '}
								{discountSummaryCopy(currency, tcContent.planCost)} afterwards
								unless you cancel. Offer only available to new subscribers who
								do not have an existing subscription with the Guardian.
							</p>
						</div>
					);
				}
			})}
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
