import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { amountText } from 'pages/supporter-plus-thank-you/components/thankYouHeader/heading';

const MAX_DISPLAY_NAME_LENGTH = 10;

interface HeadingProps {
	name: string | null;
	amount: number | undefined;
	currency: IsoCurrency;
	contributionType: ContributionType;
}

function Heading({
	name,
	amount,
	currency,
	contributionType,
}: HeadingProps): JSX.Element {
	const maybeNameAndTrailingSpace: string =
		name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';

	if (!amount || contributionType === 'ONE_OFF') {
		return (
			<div>
				Thank you {maybeNameAndTrailingSpace}for supporting us with a Digital
				Subscription ❤️
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
		case 'MONTHLY':
			return (
				<div>
					Thank you {maybeNameAndTrailingSpace}for supporting us with{' '}
					{currencyAndAmount} each month for your first year ❤️
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
					Thank you {maybeNameAndTrailingSpace}for supporting us with a Digital
					Subscription ❤️
				</div>
			);
	}
}

export default Heading;
