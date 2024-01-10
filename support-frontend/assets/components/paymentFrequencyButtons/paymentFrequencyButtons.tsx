import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, palette, space, textSans } from '@guardian/source-foundations';
import { useState } from 'react';

interface PaymentFrequencyButtonObj {
	label: string;
	isPreSelected?: boolean;
}

interface PaymentFrequencyButtonsProps {
	paymentFrequencies: PaymentFrequencyButtonObj[];
	buttonClickHandler: (buttonIndex: number) => void;
	additionalStyles?: SerializedStyles;
}

const container = (numberOfChildren: number) => css`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(${numberOfChildren}, 1fr);
	gap: 1px;
	${from.tablet} {
		width: fit-content;
	}
`;

const button = (isSelected: boolean) => css`
	background-color: ${isSelected ? palette.neutral[100] : '#A2B2CB'};
	transition: background-color 0.3s;
	${textSans.medium({
		fontWeight: 'bold',
	})}
	border: 0;
	padding: ${space[3]}px ${space[9]}px;
	color: ${palette.brand[400]};
	:hover {
		background-color: ${isSelected ? palette.neutral[100] : '#DAE0EA'};
	}
	cursor: pointer;
	:first-child {
		border-radius: ${space[3]}px 0 0 ${space[3]}px;
	}
	:last-child {
		border-radius: 0 ${space[3]}px ${space[3]}px 0;
	}
`;

export function PaymentFrequencyButtons({
	paymentFrequencies,
	buttonClickHandler,
	additionalStyles,
}: PaymentFrequencyButtonsProps): JSX.Element {
	const [selectedButton, setSelectedButton] = useState(
		Math.max(
			paymentFrequencies.findIndex(
				(paymentFrequency) => paymentFrequency.isPreSelected,
			),
			0,
		),
	);
	return (
		<div css={[container(paymentFrequencies.length), additionalStyles]}>
			{paymentFrequencies.map((paymentFrequency, buttonIndex) => (
				<button
					css={button(buttonIndex === selectedButton)}
					onClick={() => {
						setSelectedButton(buttonIndex);
						buttonClickHandler(buttonIndex);
					}}
				>
					{paymentFrequency.label}
				</button>
			))}
		</div>
	);
}
