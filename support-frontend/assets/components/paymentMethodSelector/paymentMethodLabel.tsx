import { css } from '@emotion/react';

interface PaymentMethodLabelProps {
	label: string;
	logo: JSX.Element;
	isChecked: boolean;
}

const labelContainer = css`
	display: flex;
	width: 100%;
	margin: 0;
	justify-content: space-between;
	align-items: center;

	svg {
		width: 36px;
		height: 24px;
		display: block;
	}

	&[data-checked='false'] {
		svg {
			filter: grayscale(100%);
		}
	}
`;

export function PaymentMethodLabel({
	label,
	logo,
	isChecked,
}: PaymentMethodLabelProps): JSX.Element {
	return (
		<div css={labelContainer} data-checked={isChecked.toString()}>
			<div>{label}</div>
			{logo}
		</div>
	);
}
