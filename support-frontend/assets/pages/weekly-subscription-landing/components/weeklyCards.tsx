import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';

const pricesSection = css`
	color: ${neutral[100]};
`;

const pricesHeadline = css`
	padding: ${space[8]}px 0 0;
	${headlineBold24};
	${from.tablet} {
		font-size: 34px;
	}
`;

const pricesSubHeadline = css`
	${textEgyptian17};
	padding-bottom: ${space[4]}px 0;
`;

const priceCardsContainer = css`
	margin: ${space[10]}px 0 ${space[8]}px;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border-radius: ${space[2]}px;
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
`;

type WeeklyCardsPropTypes = {
	sampleCopy: string;
};

export function WeeklyCards({ sampleCopy }: WeeklyCardsPropTypes): JSX.Element {
	return (
		<section css={pricesSection} id="subscribe weekly">
			<h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
			<p css={pricesSubHeadline}>Choose how you'd like to pay</p>
			<div css={priceCardsContainer}>{sampleCopy}</div>
		</section>
	);
}
