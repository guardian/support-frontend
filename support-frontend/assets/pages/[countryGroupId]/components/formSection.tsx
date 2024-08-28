import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
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

type FormSectionProps = {
	children: ReactNode;
};

export function FormSection({ children }: FormSectionProps) {
	return <fieldset css={fieldset}>{children}</fieldset>;
}
