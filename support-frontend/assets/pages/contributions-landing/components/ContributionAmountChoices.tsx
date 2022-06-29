// ----- Imports ----- //

import { css } from '@emotion/react';
import { until } from '@guardian/source-foundations';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/source-react-components';
import type { ContributionType, SelectedAmounts } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { AmountChange } from 'helpers/redux/checkout/product/state';
import ContributionAmountChoicesChoiceLabel from './ContributionAmountChoicesChoiceLabel';

const choiceCardGridStyles = css`
	${until.mobileLandscape} {
		> div {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 8px;

			> label {
				margin-bottom: 0px;
			}
		}
	}
`;

const choiceCardGridFullWidthOtherStyles = css`
	${choiceCardGridStyles}

	> div > label:last-of-type {
		grid-column-start: 1;
		grid-column-end: 3;
	}
`;

type ContributionAmountChoicesProps = {
	currency: IsoCurrency;
	contributionType: ContributionType;
	validAmounts: number[];
	defaultAmount: number;
	showOther: boolean;
	selectedAmounts: SelectedAmounts;
	selectAmount: (amountChange: AmountChange) => void;
	shouldShowFrequencyButtons: boolean;
};

const isSelected = (
	amount: number,
	selectedAmounts: SelectedAmounts,
	contributionType: ContributionType,
	defaultAmount: number,
) => {
	if (selectedAmounts[contributionType]) {
		return (
			selectedAmounts[contributionType] !== 'other' &&
			amount === selectedAmounts[contributionType]
		);
	}

	return amount === defaultAmount;
};

function ContributionAmountChoices({
	validAmounts,
	defaultAmount,
	contributionType,
	showOther,
	selectAmount,
	selectedAmounts,
	currency,
	shouldShowFrequencyButtons,
}: ContributionAmountChoicesProps): JSX.Element {
	const isOtherAmountFullWidth = validAmounts.length % 2 === 0;
	return (
		<ChoiceCardGroup
			name="amounts"
			columns={2}
			cssOverrides={
				isOtherAmountFullWidth
					? choiceCardGridFullWidthOtherStyles
					: choiceCardGridStyles
			}
		>
			<>
				{validAmounts.map((amount: number) => (
					<ChoiceCard
						id={`contributionAmount-${amount}`}
						key={`contributionAmount-${amount}`}
						name="contributionAmount"
						value={`${amount}`}
						checked={isSelected(
							amount,
							selectedAmounts,
							contributionType,
							defaultAmount,
						)}
						onChange={() =>
							selectAmount({
								amount: amount.toString(),
								contributionType,
							})
						}
						label={
							<ContributionAmountChoicesChoiceLabel
								formattedAmount={formatAmount(
									currencies[currency],
									spokenCurrencies[currency],
									amount,
									false,
								)}
								shouldShowFrequencyButtons={shouldShowFrequencyButtons}
								contributionType={contributionType}
							/>
						}
					/>
				))}
			</>

			<ChoiceCard
				id="contributionAmount-other"
				name="contributionAmount"
				value="other"
				checked={showOther}
				onChange={() => selectAmount({ amount: 'other', contributionType })}
				label="Other"
			/>
		</ChoiceCardGroup>
	);
}

export default ContributionAmountChoices;
