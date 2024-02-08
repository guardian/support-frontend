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
	// EXAMPLE: £16 for the first 12 months, then £25/month
	if (planCost.discount) {
		const durationValue = planCost.discount.duration.value;
		return `${currency}${planCost.discount.price} for the first ${
			durationValue > 1 ? durationValue : ''
		} ${recurringContributionPeriodMap[planCost.discount.duration.period]}${
			durationValue > 1 ? 's' : ''
		}, then ${currency}${planCost.price}/${
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
