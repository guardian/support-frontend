import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

const paymentMethodRadioWithImage = css`
	padding: ${space[2]}px ${space[3]}px;

	div label {
		width: 100%;
	}

	div label > div {
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
	}
`;

const paymentMethodRadioWithImageSelected = css`
	background-image: linear-gradient(
		to top,
		${palette.brand[500]} 2px,
		transparent 2px
	);
`;

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

export const paymentMethodBody = css`
	padding: ${space[5]}px ${space[3]}px ${space[6]}px;
`;

export const defaultRadioLabelColour = css`
	+ label div {
		color: ${palette.neutral[46]};
		font-weight: bold;
	}
`;

export const checkedRadioLabelColour = css`
	+ label div {
		color: ${palette.brand[400]};
		font-weight: bold;
	}
`;

type PaymentMethodRadioProps = {
	selected: boolean;
	children: ReactNode;
};

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
