import { css } from '@emotion/react';
import { from, headlineBold24, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

const legend = css`
	margin-bottom: ${space[3]}px;
	${headlineBold24};
	${from.tablet} {
		font-size: 28px;
	}

	display: flex;
	width: 100%;
	justify-content: space-between;
`;

type LegendProps = {
	children: ReactNode;
};

export function Legend({ children }: LegendProps) {
	return <legend css={legend}>{children}</legend>;
}
