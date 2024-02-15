import { css } from '@emotion/react';
import { palette, textSans } from '@guardian/source-foundations';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import type { TierPlanCosts } from '../setup/threeTierConfig';

interface ThreeTierDisclaimerProps {
	planCost: TierPlanCosts;
	currency: string;
}

const container = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${textSans.xxsmall({ lineHeight: 'tight' })};
`;

const discountSummaryCopy = (currency: string, planCost: TierPlanCosts) => {
	if (planCost.discount) {
		const discountDuration = planCost.discount.duration.value;
		const period =
			recurringContributionPeriodMap[planCost.discount.duration.period];
		const discountRate = `${currency}${planCost.discount.price}/${period}`;
		const introductoryPeriod = `${
			discountDuration > 1 ? discountDuration : ''
		} ${period}${discountDuration > 1 ? 's' : ''}`;
		const usualPrice = `${currency}${planCost.price}/${period}`;
		return `${discountRate} for the first ${introductoryPeriod}, then ${usualPrice}`;
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
