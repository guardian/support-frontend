import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import {
	brand,
	neutral,
	brandText,
	brandAlt,
	brandBackground,
} from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
export const componentFooter = css`
	&,
	& *,
	& *:before,
	& *:after {
		box-sizing: border-box;
	}

	background-color: ${brandBackground.primary};
	${textSans.small()};
	font-weight: 400;
	color: ${neutral[100]};

	/* TODO: Check if we can remove this; depends on styles applied to the legal text passed in
    Preferably switch to the Link component in Source for all links- current display property means we can't use it as of 2.0 */
	a,
	button {
		font-size: inherit;
		color: ${brandText.anchorPrimary};
		:hover {
			text-decoration: underline;
			color: ${brandAlt[400]};
		}
	}
`;
export const copyright = css`
	font-size: ${textSans.xsmall()};
	${until.tablet} {
		padding-top: 28px;
	}
`;
export const linksList = css`
	position: relative;
	width: 100%;
	list-style: none;

	${from.tablet} {
		display: flex;
	}

	${until.tablet} {
		columns: 2;
		column-gap: ${space[5]}px;
		padding: ${space[1]}px 0 ${space[2]}px;
		margin-bottom: ${space[2]}px;

		&:after {
			position: absolute;
			content: '';
			top: 0;
			left: 50%;
			transform: translateX(-${space[3]}px);
			height: 100%;
			border-right: 1px solid ${brand[600]};
		}
	}
`;
export const link = css`
	line-height: 19px;
	padding: 0 ${space[1]}px;

	${until.tablet} {
		padding-top: ${space[1]}px;
	}

	${from.tablet} {
		padding: ${space[2]}px ${space[5]}px ${space[4]}px;
		min-width: ${space[24]}px;

		&:first-of-type {
			padding-left: 0;
		}

		&:not(:last-child) {
			border-right: 1px solid ${brand[600]};
		}
	}
`;
export const backToTopLink = css`
	background-color: ${brandBackground.primary};
	position: absolute;
	padding: 0 ${space[1]}px;
	right: ${space[2]}px;
	top: 0;
	transform: translateY(-50%);

	& a:hover {
		text-decoration: none;
	}
`;
export const footerTextHeading = css`
	${textSans.small({
		fontWeight: 'bold',
	})};
`;
