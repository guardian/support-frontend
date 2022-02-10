import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import {
	body,
	brand,
	from,
	headline,
	neutral,
	space,
	until,
} from '@guardian/source-foundations';
import type { Breakpoint } from '@guardian/source-foundations';

export const hero = css`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	color: ${neutral[100]};
	border: none;
	padding-top: ${space[3]}px;
	background-color: ${brand[400]};
	width: 100%;

	${from.tablet} {
		flex-direction: row;
	}

	/* Typography defaults */
	${body.small()};

	${from.mobileMedium} {
		${body.medium()};
	}

	${from.desktop} {
		${headline.xxsmall()};
		line-height: 135%;
	}
	/* TODO: fix this when we port over the image components */
	.component-grid-picture {
		display: flex;
	}
`;
export const heroImage = css`
	align-self: flex-end;
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;

	${from.tablet} {
		width: 45%;
	}

	${from.desktop} {
		width: 40%;
	}

	& img {
		max-width: 100%;
	}
`;
export const heroRoundelContainer = css`
	position: absolute;
	top: ${space[3]}px;
	right: ${space[5]}px;

	${from.mobileMedium} {
		right: ${space[6]}px;
	}

	${from.mobileLandscape} {
		top: 60px;
	}

	${from.phablet} {
		top: ${space[6]}px;
	}

	${from.tablet} {
		right: 60px;
	}

	${from.desktop} {
		right: ${space[12]}px;
		top: 0;
	}
`;
export const roundelNudgeUp = css`
	${until.tablet} {
		transform: translateY(-67%);
	}
`;
export const roundelNudgeDown = css`
	${until.tablet} {
		transform: translateY(-34%);
	}
`;

function hideUntilBreakpoint(breakpoint: Breakpoint): SerializedStyles {
	return css`
		${until[breakpoint]} {
			display: none;
		}
	`;
}

export const roundelHidingPoints: Record<Breakpoint, SerializedStyles> = {
	mobile: hideUntilBreakpoint('mobile'),
	mobileMedium: hideUntilBreakpoint('mobileMedium'),
	mobileLandscape: hideUntilBreakpoint('mobileLandscape'),
	phablet: hideUntilBreakpoint('phablet'),
	tablet: hideUntilBreakpoint('tablet'),
	desktop: hideUntilBreakpoint('desktop'),
	leftCol: hideUntilBreakpoint('leftCol'),
	wide: hideUntilBreakpoint('wide'),
};
