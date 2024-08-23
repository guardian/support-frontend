import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

type PaymentMethodRadioProps = {
	selected: boolean;
	children: ReactNode;
};

const paymentMethodRadioWithImage = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: ${space[2]}px ${space[3]}px;
	font-weight: bold;
`;

const paymentMethodRadioWithImageSelected = css`
	background-image: linear-gradient(
		to top,
		${palette.brand[500]} 2px,
		transparent 2px
	);
`;

export function PaymentMethodRadio({
	selected,
	children,
}: PaymentMethodRadioProps) {
	return (
		<div
			css={[
				paymentMethodRadioWithImage,
				selected ? paymentMethodRadioWithImageSelected : undefined,
			]}
		>
			{children}
		</div>
	);
}
