import type { StudentDiscount } from '../helpers/discountDetails';
import { originalPriceStrikeThrough } from './StudentProductCardStyles';

export default function StudentPrice({
	studentDiscount,
}: {
	studentDiscount: StudentDiscount;
}) {
	const {
		discountPriceWithCurrency,
		fullPriceWithCurrency,
		periodNoun,
		promoDuration,
	} = studentDiscount;

	const showDiscountPrice =
		discountPriceWithCurrency &&
		discountPriceWithCurrency !== fullPriceWithCurrency;

	if (showDiscountPrice) {
		return (
			<>
				{discountPriceWithCurrency}
				<small>{`/${periodNoun}`}</small>
				{promoDuration && <small>{` for ${promoDuration}`}</small>}
				<span
					data-testid="original-price"
					css={originalPriceStrikeThrough}
				>{`${fullPriceWithCurrency}/${periodNoun}`}</span>
			</>
		);
	}

	return (
		<>
			{fullPriceWithCurrency}
			<small>/{periodNoun}</small>
		</>
	);
}
