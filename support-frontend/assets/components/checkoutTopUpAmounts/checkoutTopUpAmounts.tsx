import {
	Button,
	SvgArrowLeftStraight,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useState } from 'react';
import {
	amountOption,
	amountOptionAction,
	amountOptionValue,
	amountsAndNavigationContainer,
	amountsContainer,
	container,
	hrCss,
	progressBtnLeft,
	progressBtnRight,
	standfirst,
	supportTotalContainer,
	title,
} from './checkoutTopUpAmountsStyles';

export interface CheckoutTopUpAmountsProps {
	currencyWord: string;
	currencySymbol: string;
	timePeriod: string;
	amounts: number[];
	customMargin?: string;
}

export function CheckoutTopUpAmounts({
	currencyWord,
	currencySymbol,
	timePeriod,
	amounts,
	customMargin,
}: CheckoutTopUpAmountsProps): JSX.Element {
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const [xOffset, setXOffset] = useState<number>(0);
	const [selectedTopUpamount, setSelectedTopUpamount] = useState<number>(0);
	const minSwipeDistance = 50;
	const amountsOptionPercentageWidth = 25;

	const totalPercentageWidth =
		amounts.length * amountsOptionPercentageWidth + (amounts.length - 1) * 3;
	const overflowPercentageWidth =
		(totalPercentageWidth - 100) * (amounts.length - 1);

	const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) {
			return;
		}
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		if (isLeftSwipe) {
			setXOffset(Math.max(xOffset - 100, -overflowPercentageWidth));
		}
		const isRightSwipe = distance < -minSwipeDistance;
		if (isRightSwipe) {
			setXOffset(Math.min(xOffset + 100, 0));
		}
	};

	const onLeftBtnClick = () => {
		setXOffset(Math.min(xOffset + 100, 0));
	};

	const onRightBtnClick = () => {
		setXOffset(Math.max(xOffset - 100, -overflowPercentageWidth));
	};

	const hasLeftSideOverflow: boolean = xOffset < 0;
	const hasRightSideOverflow: boolean = xOffset > -overflowPercentageWidth;

	return (
		<section css={container(customMargin)}>
			<h3 css={title}>{`Every extra ${currencyWord} funds our journalism`}</h3>
			<p css={standfirst}>
				If you can, please consider adding a top up to your support.
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
				<div
					css={amountsContainer(hasLeftSideOverflow, hasRightSideOverflow)}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					{amounts.map((amount) => {
						const isSelected = amount === selectedTopUpamount;
						return (
							<div
								css={[
									amountOption(
										amountsOptionPercentageWidth,
										xOffset,
										isSelected,
									),
								]}
								onClick={() => setSelectedTopUpamount(isSelected ? 0 : amount)}
							>
								<span css={[amountOptionValue(isSelected)]}>
									{currencySymbol}
									{amount}
								</span>
								<span css={[amountOptionAction(isSelected)]} data-amount-action>
									{isSelected ? '- Remove' : '+ Add'}
								</span>
							</div>
						);
					})}
				</div>
				{hasLeftSideOverflow && (
					<Button
						hideLabel
						icon={<SvgArrowLeftStraight />}
						iconSide="left"
						priority="tertiary"
						size="default"
						cssOverrides={progressBtnLeft}
						onClick={onLeftBtnClick}
					>
						Move to previous top up amounts
					</Button>
				)}

				{hasRightSideOverflow && (
					<Button
						hideLabel
						icon={<SvgArrowRightStraight />}
						iconSide="left"
						priority="tertiary"
						size="default"
						cssOverrides={progressBtnRight}
						onClick={onRightBtnClick}
					>
						Move to next top up amounts
					</Button>
				)}
			</div>
		</section>
	);
}
