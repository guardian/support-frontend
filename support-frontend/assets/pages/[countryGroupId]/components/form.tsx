import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	space,
	until,
} from '@guardian/source/foundations';
import type { ReactNode } from 'react';

const fieldset = css`
	position: relative;

	& > *:not(:first-of-type) {
		margin-top: ${space[3]}px;
	}

	${from.tablet} {
		& > *:not(:first-of-type) {
			margin-top: ${space[4]}px;
		}
	}
`;

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

export const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

type LegendProps = {
	children: ReactNode;
};

export function Legend({ children }: LegendProps) {
	return <legend css={legend}>{children}</legend>;
}

type FormSectionProps = {
	children: ReactNode;
};

export function FormSection({ children }: FormSectionProps) {
	return <fieldset css={fieldset}>{children}</fieldset>;
}
