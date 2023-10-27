import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import {
	palette,
	pxToRem,
	space,
	textSans,
} from '@guardian/source-foundations';

export const topUpToggleContainer = css`
	background-color: #f0f6fe;
	border-radius: ${space[2]}px;
	padding: ${space[3]}px ${space[4]}px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

export const title = css`
	${textSans.medium({
		fontWeight: 'bold',
	})}
	font-size: ${pxToRem(17)};
	display: flex;
	align-items: center;

	> svg {
		margin-right: ${pxToRem(5)}px;
		transform: translateX(-3px);

		> path {
			fill: ${palette.success[400]};
		}
	}
`;

export const standfirst = css`
	${textSans.small()}
	color: ${palette.neutral[7]};
`;

export const toggleSwitchOverrides: SerializedStyles = css`
	> button {
		margin-right: 0px;
	}
`;
