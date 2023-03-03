import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

const MAX_DISPLAY_NAME_LENGTH = 10;

interface HeadingProps {
	name: string | null;
	amount: string;
	currency: IsoCurrency;
	billingPeriod: BillingPeriod;
}

function Heading({ name, amount, billingPeriod }: HeadingProps): JSX.Element {
	const maybeNameAndTrailingSpace: string =
		name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';

	if (!amount) {
		return (
			<div>
				Thank you {maybeNameAndTrailingSpace}for supporting us with a Digital
				Subscription ❤️
			</div>
		);
	}

	if (billingPeriod === 'Monthly') {
		return (
			<div>
				Thank you {maybeNameAndTrailingSpace}for supporting us with {amount}{' '}
				each month for your first year ❤️
			</div>
		);
	}

	if (billingPeriod === 'Annual') {
		return (
			<div>
				Thank you {maybeNameAndTrailingSpace}for supporting us with {amount}{' '}
				each year ❤️
			</div>
		);
	}

	return (
		<div>
			Thank you {maybeNameAndTrailingSpace}for supporting us with a Digital
			Subscription ❤️
		</div>
	);
}

export default Heading;
