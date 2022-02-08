import type { ContributionType } from 'helpers/contributions';
import 'helpers/contributions';
import { css } from '@emotion/react';

type ContributionAmountLabelProps = {
	formattedAmount: string;
	shouldShowFrequencyButtons: boolean;
	contributionType: ContributionType;
};

const ContributionAmountChoicesChoiceLabel = ({
	formattedAmount,
	shouldShowFrequencyButtons,
	contributionType,
}: ContributionAmountLabelProps) => {
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
};

export default ContributionAmountChoicesChoiceLabel;
