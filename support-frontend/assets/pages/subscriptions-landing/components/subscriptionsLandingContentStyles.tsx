import { css } from '@emotion/react';
import { brandAlt, from, neutral, until } from '@guardian/source/foundations';

export const subscriptionsProductContainerStyle = css`
	position: relative;
	padding: 0 0 40px;
	background-color: ${neutral[93]};

	${from.desktop} {
		padding: 0 10px 40px;
	}

	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100px;
		border-bottom: 1px solid ${neutral[86]};
		background-color: ${brandAlt[400]};
		display: block;
		top: 0;
		left: 0;
	}
`;

export const heroCardContainer = css`
	position: relative;
	display: flex;
	align-items: stretch;
	width: 100%;
	margin: 0 auto;
	flex-wrap: wrap;
	max-width: 1290px;
	border: 1px solid ${neutral[86]};
	min-height: 320px;
	background-color: ${neutral[97]};
	z-index: 1;
	margin: 20px auto;

	${from.desktop} {
		width: calc(100% - 40px);
		min-height: 0;
	}

	${from.mobileLandscape} {
		width: calc(100% - 20px);
	}

	&:first-child {
		margin-top: 0;
	}

	&:nth-child(odd) {
		${from.tablet} {
			flex-direction: row-reverse;
		}
	}
`;

export const pageTitleStyles = css`
	background-color: ${brandAlt[400]};

	h1 {
		max-width: 900px;
		${until.tablet} {
			font-size: 32px;
		}
	}
`;
