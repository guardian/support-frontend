import { css } from '@emotion/react';
import {
	brand,
	brandAlt,
	from,
	neutral,
	until,
} from '@guardian/source/foundations';
import {
	brandPastel,
	gu_h_spacing,
	gu_span,
	gu_v_spacing,
} from '../header/headerStyles';

export const linksNavHide = css`
	${until.tablet} {
		display: none;
	}
`;
export const linksNav = css`
	${until.tablet} {
		display: block;
		clear: both;
	}
	${from.tablet} {
		display: flex;
		justify-content: flex-start;
		background-color: ${brand[400]};
		border-top: 1px solid ${brandPastel};
		z-index: 9;
		white-space: nowrap;
		margin: 0 ${gu_h_spacing * -2}px 0 0;
		box-sizing: border-box;

		@media (min-width: ${gu_span(12) + 40}px) {
			margin: 0 ${gu_h_spacing * -1}px;
			border-left: 1px solid ${brandPastel};
			border-right: 1px solid ${brandPastel};
		}
	}
`;

export const linksList = css`
	list-style: none;
	${from.tablet} {
		display: inline-flex;
		width: auto;
		* {
			flex: 0 0 auto;
			display: block;
		}
	}
`;

export const linksListItemActive = css`
	${from.tablet} {
		a {
			box-shadow: inset 0 4px 0 ${brandAlt[400]};
		}
	}
`;

export const linksListItemTabletDisplay = css`
	display: block;

	// custom breakpoint - we are using a 'custom breakpoint' because this is linked to the menu toggle which has a custom break point applied in js
	@media (min-width: 884px) {
		display: none;
	}
`;

export const linksListItem = css`
	${until.tablet} {
		margin-left: ${gu_h_spacing * 2.5}px;
		border-top: 1px solid ${brandPastel};
		:first-child {
			border-top: none;
		}
	}
	${from.tablet} {
		:first-child {
			a {
				padding-left: ${gu_h_spacing}px;
			}
		}
		:last-child {
			a {
				:after {
					display: none;
				}
			}
		}
	}
`;

export const linksListItemNavigate = css`
	display: block;
	overflow: hidden;
	position: relative;
	font-family: GH Guardian Headline;
	font-weight: 900;
	line-height: 90%;
	text-decoration: none;
	color: ${neutral[100]};
	box-shadow: inset 0 0 0 ${brandAlt[400]};

	${until.tablet} {
		font-size: 24px;
		padding: ${gu_v_spacing * 0.5}px ${gu_h_spacing}px ${gu_v_spacing * 1.5}px 0;
		transition: 0.2s linear;
		:hover,
		:focus {
			text-decoration: underline;
		}
	}
	${from.tablet} {
		font-size: 20px;
		padding: ${gu_v_spacing / 1.75}px ${gu_h_spacing * 1.5}px
			${gu_v_spacing / 1.5}px ${gu_h_spacing / 3}px;
		transition: 0.3s ease-in-out;
		height: ${gu_v_spacing * 3.5}px;
		box-sizing: border-box;
		:hover {
			box-shadow: inset 0 4px 0 ${brandAlt[400]};
		}
		:after {
			content: '';
			position: absolute;
			right: 0;
			bottom: 14px;
			top: 0;
			width: 1px;
			background-color: ${brandPastel};
		}
	}
`;
