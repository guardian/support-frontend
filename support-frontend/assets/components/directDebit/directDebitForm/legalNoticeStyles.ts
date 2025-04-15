import { css } from '@emotion/react';
import {
	palette,
	space,
	textSans12,
	until,
} from '@guardian/source/foundations';

export const legalNotice = css`
	${textSans12}
	color: ${palette.neutral[46]};
	margin-top: ${space[5]}px;
	margin-bottom: ${space[3]}px;
	display: inline-block;

	a {
		color: ${palette.neutral[46]};
	}

	strong {
		font-weight: bold;
	}

	${until.tablet} {
		p {
			margin-bottom: ${space[1]}px;
		}
	}
`;
