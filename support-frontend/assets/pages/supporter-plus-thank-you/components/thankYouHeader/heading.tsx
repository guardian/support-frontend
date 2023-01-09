import { css } from '@emotion/react';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';

const MAX_DISPLAY_NAME_LENGTH = 10;

const amountText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;

interface HeadingProps {
	name: string | null;
	isOneOffPayPal: boolean;
	amount: number | undefined;
	currency: IsoCurrency;
	contributionType: ContributionType;
}

function Heading({
	name,
	isOneOffPayPal,
	amount,
	currency,
	contributionType,
}: HeadingProps): JSX.Element {
	const maybeNameAndTrailingSpace: string =
		name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';

	// Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
	if (isOneOffPayPal || !amount) {
		return (
			<div>
				Thank you {maybeNameAndTrailingSpace}for your valuable contribution
			</div>
		);
	}

	const currencyAndAmount = (
		<span css={amountText}>
			{formatAmount(
				currencies[currency],
				spokenCurrencies[currency],
				amount,
				false,
			)}
		</span>
	);

	switch (contributionType) {
		case 'ONE_OFF':
			return (
				<div>Thank you for supporting us today with {currencyAndAmount} ❤️</div>
			);

		case 'MONTHLY':
			return (
				<div>
					Thank you {maybeNameAndTrailingSpace}for supporting us with{' '}
					{currencyAndAmount} each month ❤️
				</div>
			);

		case 'ANNUAL':
			return (
				<div>
					Thank you {maybeNameAndTrailingSpace}for supporting us with{' '}
					{currencyAndAmount} each year ❤️
				</div>
			);

		default:
			return (
				<div>
					Thank you {maybeNameAndTrailingSpace}for your valuable contribution
				</div>
			);
	}
}

export default Heading;
