import { css } from '@emotion/react';
import { visuallyHidden } from '@guardian/source/foundations';

const originalPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const visuallyHiddenCss = css`
	${visuallyHidden};
`;

function displayPeriod(
	price: string,
	divider: string,
	period?: string,
): string {
	return `${price}${period ? `${divider}${period}` : ''}`;
}

type PriceSummaryProps = {
	fullPrice: string;
	period?: string;
	discountPrice?: string;
	isWeeklyGift?: boolean;
};

export function PriceSummary({
	fullPrice,
	period,
	discountPrice,
	isWeeklyGift,
}: PriceSummaryProps): JSX.Element {
	const displayPricePeriod = () => {
		const divider = isWeeklyGift ? ' for ' : '/';
		if (discountPrice) {
			return (
				<>
					<span css={originalPriceStrikeThrough}>
						<span css={visuallyHiddenCss}>Was </span>
						{fullPrice}
						<span css={visuallyHiddenCss}>, now</span>
					</span>{' '}
					{displayPeriod(discountPrice, divider, period)}
				</>
			);
		}
		return displayPeriod(fullPrice, divider, period);
	};

	return <p>{displayPricePeriod()}</p>;
}
