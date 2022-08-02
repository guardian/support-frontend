import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { TextInput } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import { amountIsValid } from 'helpers/forms/formValidation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

// ----- Component ----- //

export interface ContributionAmountOtherAmountFieldProps {
	amount: string;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	min: number;
	max: number;
	currency: IsoCurrency;
	canShowErrorMessage: boolean;
	onChange: (amount: string) => void;
	onBlur: () => void;
	localCurrencyCountry?: LocalCurrencyCountry;
	useLocalCurrency: boolean;
}

export function ContributionAmountOtherAmountField({
	amount,
	countryGroupId,
	contributionType,
	min,
	max,
	currency,
	canShowErrorMessage,
	onChange,
	onBlur,
	localCurrencyCountry,
	useLocalCurrency,
}: ContributionAmountOtherAmountFieldProps): JSX.Element {
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

	const glyph: string = currencies[currency].glyph;

	const errorMessage =
		canShowErrorMessage &&
		!amountIsValid(
			amount,
			countryGroupId,
			contributionType,
			localCurrencyCountry,
			useLocalCurrency,
		)
			? `Please provide an amount between ${minAmount} and ${maxAmount}`
			: '';

	return (
		<div
			className={classNameWithModifiers('form__field', [
				'contribution-other-amount',
			])}
		>
			<p css={glyphStyles}>{glyph}</p>

			<TextInput
				id="contributionOther"
				data-testid="other-amount-input"
				cssOverrides={inputStyles}
				label={`Other amount`}
				value={amount}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				error={errorMessage}
				autoComplete="off"
				autoFocus
				inputMode="numeric"
				pattern="[0-9]*"
			/>
		</div>
	);
}

// ---- Styles ---- //

const inputStyles = css`
	padding-left: ${space[5]}px;
`;

const glyphStyles = css`
	position: absolute;
	font-weight: bold;
	bottom: 22px; // half of the fixed height of the input element we get from source
	transform: translateY(50%);
	padding-left: ${space[2]}px;
`;
