import { css } from '@emotion/react';
import { from, palette, space, textSans12 } from '@guardian/source/foundations';

export const container = css`
	${textSans12}
	color: ${palette.neutral[97]};
	background-color: ${palette.brand[400]};
	position: relative;
	align-content: end;
	> div {
		padding: ${space[4]}px 10px ${space[4]}px;
		display: flex;
		justify-content: center;
		border-bottom: 1px solid ${palette.brand[600]};
		${from.tablet} {
			width: 742px;
			border-left: 1px solid ${palette.brand[600]};
			border-right: 1px solid ${palette.brand[600]};
		}
		${from.desktop} {
			width: 982px;
		}
		${from.leftCol} {
			width: 1142px;
		}
		${from.wide} {
			width: 1302px;
		}
	}
	> div > div {
		max-width: 940px;
		& a {
			font-weight: bold;
			color: ${palette.neutral[97]};
			:visited {
				color: ${palette.neutral[97]};
			}
		}
	}
`;
