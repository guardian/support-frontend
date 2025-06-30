import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold42,
	palette,
	space,
	textSans17,
	textSansBold17,
} from '@guardian/source/foundations';

export const containerCardsAndSignIn = css`
	background-color: ${palette.brand[400]};
	> div {
		position: relative;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding: ${space[8]}px 10px 0px;
		${from.tablet} {
			align-items: center;
		}
	}
`;

export const headingWrapper = css`
	color: ${palette.neutral[100]};
	margin-top: ${space[1]}px;
	${from.tablet} {
		text-align: center;
		max-width: 468px;
	}
	${from.desktop} {
		max-width: 740px;
	}
`;

export const heading = css`
	${headlineBold28}
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		font-size: ${headlineBold42};
	}
`;

export const subheading = css`
	${textSans17}
`;

export const universityBadge = css`
	${textSansBold17}
	color: ${palette.neutral[100]};
	background-color: rgba(255, 255, 255, 0.15);
	padding: ${space[1]}px ${space[2]}px;
	display: flex;
	align-items: center;
	border-radius: ${space[1]}px;
	> span {
		border-left: 1px solid ${palette.neutral[100]};
		margin-left: ${space[3]}px;
		padding-left: ${space[3]}px;
	}
`;

export const cardcontainer = css`
	display: flex;
	padding: ${space[9]}px 0;
`;
