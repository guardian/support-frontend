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

export const component_header_links_mobile_hide = css`
	${until.tablet} {
		display: none;
	}
`;
export const component_header_links = css`
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
			margin: 0 ${gu_h_spacing * -1}px 0 0;
			border-left: 1px solid ${brandPastel};
			border-right: 1px solid ${brandPastel};
		}
	}
`;

export const component_header_links__ul = css`
	${until.tablet} {
		list-style: none;
	}
	${from.tablet} {
		list-style: none;
		display: inline-flex;
		width: auto;
		> * {
			flex: 0 0 auto;
			display: block;
		}
	}
`;

export const component_header_links__li = css`
	${until.tablet} {
		margin-left: ${gu_h_spacing * 2.5}px;
		border-top: 1px solid ${brandPastel};
		&:first-child {
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
				&:after {
					display: none;
				}
			}
		}
	}
`;

export const component_header_links__link = css`
	${until.tablet} {
		font-family: GH Guardian Headline;
		font-size: 24px;
		font-weight: 900;
		line-height: 90%;
		color: ${neutral[100]};
		text-decoration: none;
		display: block;
		padding: ${gu_v_spacing * 0.5}px ${gu_h_spacing}px ${gu_v_spacing * 1.5}px 0;
		overflow: hidden;
		position: relative;
		box-shadow: inset 0 0 0 ${brandAlt[400]};
		transition: 0.2s linear;

		&:hover,
		&:focus {
			text-decoration: underline;
		}
	}
	${from.tablet} {
		font-family: GH Guardian Headline;
		font-size: 20px;
		font-weight: 900;
		line-height: 90%;
		color: ${neutral[100]};
		text-decoration: none;
		display: block;
		height: ${gu_v_spacing * 3.5}px;
		padding: ${gu_v_spacing / 1.75}px ${gu_h_spacing * 1.5}px
			${gu_v_spacing / 1.5}px ${gu_h_spacing / 3}px;
		overflow: hidden;
		position: relative;
		box-shadow: inset 0 0 0 ${brandAlt[400]};
		transition: 0.3s ease-in-out;
		box-sizing: border-box;

		&:hover {
			box-shadow: inset 0 4px 0 ${brandAlt[400]};
		}

		&:after {
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
