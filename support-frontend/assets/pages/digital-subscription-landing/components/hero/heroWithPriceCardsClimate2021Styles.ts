// ----- Imports ----- //
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { brand, brandAlt } from '@guardian/src-foundations/palette';
import { body, headline } from '@guardian/src-foundations/typography';

export const heroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	position: relative;
`;
export const heroTitle = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		${headline.medium({
			fontWeight: 'bold',
		})};
	}

	${from.desktop} {
		${headline.large({
			fontWeight: 'bold',
		})};
	}
`;
export const yellowHeading = css`
	color: ${brandAlt[400]};
`;
export const paragraphs = css`
	p {
		${body.small()};
		max-width: 100%;
		margin-bottom: ${space[6]}px;

		${from.mobileMedium} {
			${body.medium()};
		}

		${from.phablet} {
			${body.medium()};
			max-width: 85%;
			margin-bottom: ${space[9]}px;
		}

		${from.desktop} {
			${headline.xxsmall()};
			line-height: 135%;
			max-width: 90%;
		}
	}

	p:not(:last-of-type) {
		margin-bottom: ${space[5]}px;
	}

	strong {
		font-weight: 600;
	}
`;
export const circleTextGeneric = css`
	${headline.xxsmall({
		fontWeight: 'bold',
	})};
`;
export const mobileLineBreak = css`
	display: block;

	${from.desktop} {
		display: none;
	}
`;
export const roundelOverrides = css`
	display: none;

	${from.tablet} {
		display: flex;
		transform: translate(${space[6]}px, -75%);
	}
`;
export const embeddedRoundel = css`
	transform: translateY(0);
`;

export const pageTitleOverride = css`
	:before {
		background-color: ${brand[300]};
	}
	background-color: ${brand[300]};
	position: relative;
`;

export const heroOverride = css`
	background-color: transparent;
`;
