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

type RowsProps = {
	gap?: 'small' | 'normal' | 'large';
	children: ReactNode;
};

export default function Rows({
	children,
	gap = 'normal',
}: RowsProps): JSX.Element {
	return (
		<div css={marginTop(gap === 'small' ? 0.5 : gap === 'large' ? 2 : 1)}>
			{children}
		</div>
	);
}
