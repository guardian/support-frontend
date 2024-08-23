import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

const paymentMethodSelected = css`
	box-shadow: inset 0 0 0 2px ${palette.brand[500]};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const paymentMethodNotSelected = css`
	/* Using box shadows prevents layout shift when the rows are expanded */
	box-shadow: inset 0 0 0 1px ${palette.neutral[46]};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

type PaymentMethodSelectorProps = {
	selected: boolean;
	children: ReactNode;
};

export function PaymentMethodSelector({
	selected,
	children,
}: PaymentMethodSelectorProps) {
	return (
		<div css={selected ? paymentMethodSelected : paymentMethodNotSelected}>
			{children}
		</div>
	);
}
