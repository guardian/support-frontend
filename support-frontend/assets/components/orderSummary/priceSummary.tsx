import { css } from '@emotion/react';
import { visuallyHidden } from '@guardian/source/foundations';

const originalPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const visuallyHiddenCss = css`
	${visuallyHidden};
`;

function displayPeriod(price: string, period: string | undefined): string {
	return `${price}${period ? `/${period}` : ''}`;
}

type PriceSummaryProps = {
	fullPrice: string;
	period?: string;
	discountPrice?: string;
};

export function PriceSummary({
	fullPrice,
	period,
	discountPrice,
}: PriceSummaryProps): JSX.Element {
	const displayPricePeriod = () => {
		if (discountPrice) {
			return (
				<>
					<span css={originalPriceStrikeThrough}>
						<span css={visuallyHiddenCss}>Was </span>
						{fullPrice}
						<span css={visuallyHiddenCss}>, now</span>
					</span>{' '}
					{displayPeriod(discountPrice, period)}
				</>
			);
		}
		return displayPeriod(fullPrice, period);
	};

	return <p>{displayPricePeriod()}</p>;
}
