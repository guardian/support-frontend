import { css } from '@emotion/react';
import type { ContributionType } from 'helpers/contributions';

type ContributionAmountLabelProps = {
	formattedAmount: string;
	shouldShowFrequencyButtons: boolean;
	contributionType: ContributionType;
};

function ContributionAmountChoicesChoiceLabel({
	formattedAmount,
	shouldShowFrequencyButtons,
	contributionType,
}: ContributionAmountLabelProps): JSX.Element {
	let frequencyLabel = '';

	if (shouldShowFrequencyButtons) {
		if (contributionType === 'MONTHLY') {
			frequencyLabel = ' per month';
		}

		if (contributionType === 'ANNUAL') {
			frequencyLabel = ' per year';
		}
	}

	return (
		<div
			css={css`
				white-space: nowrap;
			`}
		>
			{formattedAmount}
			{frequencyLabel}
		</div>
	);
}

export default ContributionAmountChoicesChoiceLabel;
