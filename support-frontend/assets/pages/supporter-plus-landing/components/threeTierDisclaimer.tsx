import { css } from '@emotion/react';
import { palette, textSans } from '@guardian/source-foundations';
import type { TierPlanCosts } from '../setup/threeTierConfig';
import { discountSummaryCopy } from './threeTierCard';

interface ThreeTierDisclaimerProps {
	planCost: TierPlanCosts;
	currency: string;
}

const container = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${textSans.xxsmall({ lineHeight: 'tight' })};
`;

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
