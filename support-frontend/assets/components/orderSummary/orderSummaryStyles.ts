import { css } from '@emotion/react';
import {
	between,
	from,
  headlineBold17,
  headlineBold24,
  headlineMedium17,
	neutral,
  palette,
	space,
  textSans14,
  textSans15,
  textSansBold17,
	until,
} from '@guardian/source/foundations';

export const wrapper = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	${until.desktop} {
		padding: ${space[2]}px ${space[3]}px;
	}
	${until.tablet} {
		box-shadow: 0 4px 4px ${palette.neutral[86]};
	}
`;
export const topLine = css`
	width: calc(100%-${space[3]}px * 2);
	padding: 0 ${space[3]}px;

	${until.desktop} {
		/* border-top: 1px solid ${neutral['93']}; */
		padding: ${space[1]}px 0 ${space[2]}px;
	}

	a,
	a:visited {
		display: block;
		${textSans15};
		color: ${palette.neutral[7]};
		text-decoration: none;
		${from.desktop} {
			${textSansBold17};
		}
	}

	${between.phablet.and.desktop} {
		display: block;
	}
`;
export const topLineBorder = css`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	${from.tablet} {
		padding-bottom: ${space[3]}px;
		border-bottom: 1px solid ${neutral[86]};
	}

	${from.desktop} {
		padding-top: ${space[3]}px;
	}
`;
export const title = css`
	${headlineBold17};
/**
//Is this comment now redundant?
 * @TODO Typography preset styles should not be overridden.
 * Please speak to your team's designer and update this to use a more appropriate preset.
*/
line-height: 1.4;;

    ${from.desktop} {
		${headlineBold24}
	}
`;
export const contentBlock = css`
	display: flex;
	width: 100%;

	${from.tablet} {
		display: block;
	}

	${from.desktop} {
		border-bottom: 1px solid ${neutral[60]};
	}
`;
export const mobileSummary = css`
	${headlineMedium17};
	width: 100%;

	h4 {
		font-weight: 700;
	}

	${from.desktop} {
		display: none;
	}
`;
export const imageContainer = css`
	display: inline-flex;
	align-items: flex-start;
	background-color: ${neutral[100]};

	img {
		width: 100%;
		height: auto;
	}

	${until.tablet} {
		padding: 0;
		width: 75px;
		height: 45px;
		overflow: hidden;
		img {
			align-items: flex-end;
		}
	}

	${from.tablet} {
		padding: ${space[3]}px 0;
	}

	${from.desktop} {
		padding: ${space[9]}px 0;
	}
`;
export const products = css`
	display: none;

	${from.desktop} {
		display: block;
	}
`;
export const infoContainer = css`
	padding: 0 ${space[2]}px;
`;
export const info = css`
	${textSans14};
	line-height: 22px;
	display: flex;
	padding: ${space[2]}px 0;
	border-top: 1px solid ${neutral[86]};

	svg {
		/* Repeat height here to fix Safari issue with inline-flex SVGs */
		height: 22px;
		max-width: 22px;
		fill: ${palette.brand[400]};
		margin-right: ${space[2]}px;
	}
`;
export const total = css`
	${headlineBold24};
	background-color: ${neutral[97]};
	padding: ${space[2]}px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
