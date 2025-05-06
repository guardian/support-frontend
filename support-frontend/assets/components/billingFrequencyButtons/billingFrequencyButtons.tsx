import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';
import { useState } from 'react';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

interface BillingFrequencyButtonObj {
	billingFrequencyLabel: string;
	billingFrequencyId: BillingPeriod;
	isPreSelected?: boolean;
}

export interface BillingFrequencyButtonsProps {
	billingFrequencies: BillingFrequencyButtonObj[];
	buttonClickHandler: (buttonIndex: number) => void;
	additionalStyles?: SerializedStyles;
}

const container = (numberOfChildren: number) => css`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(${numberOfChildren}, minmax(0, 1fr));
	gap: 1px;
	${from.tablet} {
		width: fit-content;
	}
`;

const button = (isSelected: boolean) => css`
	background-color: ${isSelected ? palette.neutral[100] : '#A2B2CB'};
	transition: background-color 0.3s;
	${textSansBold17};
	border: 0;

	padding: ${space[3]}px 0;
	${from.tablet} {
		padding: ${space[3]}px ${space[9]}px;
	}

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

export function BillingFrequencyButtons({
	billingFrequencies,
	buttonClickHandler,
	additionalStyles,
}: BillingFrequencyButtonsProps): JSX.Element {
	const [selectedButton, setSelectedButton] = useState(
		Math.max(
			billingFrequencies.findIndex(
				(billingFrequency) => billingFrequency.isPreSelected,
			),
			0,
		),
	);
	return (
		<div
			css={[container(billingFrequencies.length), additionalStyles]}
			role="tablist"
			aria-label="Billing frequency options"
		>
			{billingFrequencies.map((billingFrequency, buttonIndex) => (
				<button
					css={button(buttonIndex === selectedButton)}
					role="tab"
					id={billingFrequency.billingFrequencyId}
					aria-controls={`${billingFrequency.billingFrequencyId}-tab`}
					aria-selected={buttonIndex === selectedButton}
					onClick={() => {
						setSelectedButton(buttonIndex);
						buttonClickHandler(buttonIndex);
					}}
				>
					{billingFrequency.billingFrequencyLabel}
				</button>
			))}
		</div>
	);
}
