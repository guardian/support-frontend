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
	period: string,
	showPeriod: boolean,
): string {
	return `${price}${showPeriod ? `${divider}${period}` : ''}`;
}

type PriceSummaryProps = {
	fullPrice: string;
	period: string;
	discountPrice?: string;
	isWeeklyGift?: boolean;
	showPeriod: boolean;
};

export function PriceSummary({
	fullPrice,
	period,
	discountPrice,
	isWeeklyGift,
	showPeriod,
}: PriceSummaryProps): JSX.Element {
	const divider = isWeeklyGift ? ' for ' : '/';

	if (discountPrice) {
		return (
			<p>
				<span css={originalPriceStrikeThrough}>
					<span css={visuallyHiddenCss}>Was </span>
					{fullPrice}
					<span css={visuallyHiddenCss}>, now</span>
				</span>{' '}
				{displayPeriod(discountPrice, divider, period, showPeriod)}
			</p>
		);
	}

	return <p>{displayPeriod(fullPrice, divider, period, showPeriod)}</p>;
}
