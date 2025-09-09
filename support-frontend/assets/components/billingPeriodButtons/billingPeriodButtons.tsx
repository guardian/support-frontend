import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'react';
import { getBillingPeriodTitle } from 'helpers/productPrice/billingPeriods';

export interface BillingPeriodButtonsProps {
	billingPeriods: BillingPeriod[];
	preselectedBillingPeriod?: BillingPeriod;
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

export function BillingPeriodButtons({
	billingPeriods,
	preselectedBillingPeriod,
	buttonClickHandler,
	additionalStyles,
}: BillingPeriodButtonsProps): JSX.Element {
	const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(
		preselectedBillingPeriod ?? billingPeriods[0],
	);
	return (
		<div
			css={[container(billingPeriods.length), additionalStyles]}
			role="tablist"
			aria-label="Payment frequency options"
		>
			{billingPeriods.map((billingPeriod, idx) => {
				const isSelected = billingPeriod === selectedBillingPeriod;
				return (
					<button
						css={button(isSelected)}
						role="tab"
						id={billingPeriod}
						aria-controls={`${billingPeriod}-tab`}
						aria-selected={isSelected}
						onClick={() => {
							setSelectedBillingPeriod(billingPeriod);
							buttonClickHandler(idx);
						}}
					>
						{getBillingPeriodTitle(billingPeriod)}
					</button>
				);
			})}
		</div>
	);
}
