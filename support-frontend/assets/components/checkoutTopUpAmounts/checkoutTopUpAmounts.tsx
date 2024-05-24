import { useState } from 'react';
import {
	amountOption,
	amountOptionAction,
	amountOptionValue,
	amountsAndNavigationContainer,
	amountsContainer,
	container,
	hrCss,
	standfirst,
	supportTotalContainer,
	title,
} from './checkoutTopUpAmountsStyles';

export interface CheckoutTopUpAmountsProps {
	currencySymbol: string;
	timePeriod: string;
	amounts: number[];
	isAboveThreshold: boolean;
	handleAmountUpdate?: (updateAmountBy: number, index: number) => void;
	customMargin?: string;
}

export function CheckoutTopUpAmounts({
	currencySymbol,
	timePeriod,
	amounts,
	isAboveThreshold,
	handleAmountUpdate,
	customMargin,
}: CheckoutTopUpAmountsProps): JSX.Element {
	const [selectedTopUpamount, setSelectedTopUpamount] = useState<number>(0);
	const amountsLength = amounts.length;

	if (!isAboveThreshold) {return <></>;}
	return (
		<section css={container(customMargin)}>
			<h3 css={title}>Your support funds our journalism</h3>
			<p css={standfirst}>
				{`If you can, please consider adding a little more every ${timePeriod}.`}
			</p>
			<hr css={hrCss} />
			<section css={supportTotalContainer}>
				<span>Choose amount</span>
				<span>
					{currencySymbol}
					{selectedTopUpamount}/{timePeriod}
				</span>
			</section>
			<div css={amountsAndNavigationContainer}>
				<div css={amountsContainer}>
					{amounts.map((amount, index) => {
						const isSelected = amount === selectedTopUpamount;
						return (
							<div
								css={[amountOption(isSelected, amountsLength)]}
								onClick={() => {
									if (handleAmountUpdate) {
										handleAmountUpdate(
											isSelected ? -amount : amount - selectedTopUpamount,
											index,
										);
									}
									setSelectedTopUpamount(isSelected ? 0 : amount);
								}}
								data-qm-clickable={true}
							>
								<span css={[amountOptionValue(isSelected)]}>
									{currencySymbol}
									{amount}
								</span>
								<span css={[amountOptionAction(isSelected)]} data-amount-action>
									{isSelected ? 'Remove' : 'Add'}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
