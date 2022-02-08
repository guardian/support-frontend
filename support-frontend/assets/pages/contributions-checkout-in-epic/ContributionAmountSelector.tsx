import { css } from '@emotion/react';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/src-choice-card';
import { space } from '@guardian/src-foundations';
import { TextInput } from '@guardian/src-text-input';
import type {
	ContributionAmounts,
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { config } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import { amountIsValid } from 'helpers/forms/formValidation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { formatAmountLabel } from './helpers';

// ---- Component ---- //

interface ContributionAmountSelectorProps {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	currency: IsoCurrency;
	amounts: ContributionAmounts;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	shouldShowOtherAmountErrorMessage: boolean;
	setSelectedAmount: (amount: number | 'other') => void;
	setOtherAmount: (amount: string) => void;
}

export function ContributionAmountSelector({
	countryGroupId,
	contributionType,
	currency,
	amounts,
	selectedAmounts,
	otherAmounts,
	shouldShowOtherAmountErrorMessage,
	setSelectedAmount,
	setOtherAmount,
}: ContributionAmountSelectorProps): JSX.Element {
	const { min, max } = config[countryGroupId][contributionType];
	const minAmount = formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		min,
		false,
	);
	const maxAmount = formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		max,
		false,
	);

	const otherAmountErrorMessage =
		shouldShowOtherAmountErrorMessage &&
		selectedAmounts[contributionType] === 'other' &&
		!amountIsValid(
			otherAmounts[contributionType].amount ?? '',
			countryGroupId,
			contributionType,
		)
			? `Please provide an amount between ${minAmount} and ${maxAmount}`
			: '';

	return (
		<div>
			<ChoiceCardGroup
				name="contribution-amount"
				cssOverrides={styles.container}
			>
				<>
					{amounts[contributionType].amounts.map((amount) => (
						<ChoiceCard
							id={`contribution-amount-${amount}`}
							label={formatAmountLabel(amount, contributionType, currency)}
							value={`${amount}`}
							checked={selectedAmounts[contributionType] === amount}
							onChange={() => {
								setSelectedAmount(amount);
							}}
						/>
					))}

					<ChoiceCard
						id="contribution-amount-other-choice"
						label="Other"
						value="other"
						checked={selectedAmounts[contributionType] === 'other'}
						onChange={() => setSelectedAmount('other')}
					/>
				</>
			</ChoiceCardGroup>

			{selectedAmounts[contributionType] === 'other' && (
				<div css={styles.otherAmountInputContainer}>
					<TextInput
						id="contribution-amount-other-input"
						label={'Other amount'}
						value={`${currencies[currency].glyph}${
							otherAmounts[contributionType].amount ?? ''
						}`}
						onChange={(e) => {
							setOtherAmount(e.target.value.slice(1));
						}}
						error={otherAmountErrorMessage}
						autoComplete="off"
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</div>
			)}
		</div>
	);
}

// ---- Styles ---- //

export const styles = {
	container: css`
		margin-top: ${space[4]}px;
	`,
	otherAmountInputContainer: css`
		margin-top: ${space[3]}px;
	`,
};
