import { css } from '@emotion/react';
import type { ReactNode } from 'react';
import { gu_v_spacing } from 'stylesheets/emotion/layout';

function marginTop(multiplier: number) {
	return css`
		> * + * {
			margin-top: ${gu_v_spacing * multiplier}px;
		}
	`;
}

type Gap = 'normal' | 'large';
const gapSizing: Record<Gap, number> = {
	normal: 1,
	large: 2,
};

type RowsProps = {
	gap?: Gap;
	children: ReactNode;
};
export default function Rows({
	gap = 'normal',
	children,
}: RowsProps): JSX.Element {
	return <div css={marginTop(gapSizing[gap])}>{children}</div>;
}
