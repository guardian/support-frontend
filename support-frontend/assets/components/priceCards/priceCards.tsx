import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source/foundations';
import { ChoiceCardGroup } from '@guardian/source/react-components';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import type { PriceCardPaymentInterval } from './priceCard';
import { PriceCard } from './priceCard';

const cardStyles = css`
	label {
		border-radius: 10px;
	}
`;

const lastButtonFullWidthStyles = css`
	> div > label:last-of-type {
		grid-column-start: 1;
		grid-column-end: 3;
	}
`;

const mobileGrid = css`
	> div {
		${until.mobileLandscape} {
			display: grid;
			column-gap: ${space[2]}px;
			grid-template-columns: repeat(2, 1fr);
		}
	}
`;

const cardsContainer = css`
	position: relative;
	padding: ${space[2]}px 0;

	${from.mobileLandscape} {
		padding: ${space[3]}px 0;
	}

	${from.tablet} {
		padding: ${space[2]}px 0;
	}

	:not(:last-child) {
		${until.mobileLandscape} {
			padding-bottom: 10px;
		}
		${until.tablet} {
			padding-bottom: ${space[1]}px;
		}
		padding-bottom: ${space[4]}px;
	}
`;

function getChoiceCardGroupStyles(lastButtonFullWidth: boolean) {
	if (!lastButtonFullWidth) {
		return [cardStyles, mobileGrid];
	}
	return [cardStyles, lastButtonFullWidthStyles, mobileGrid];
}

export type PriceCardsProps = {
	amounts: number[];
	selectedAmount: number | 'other';
	currency: IsoCurrency;
	onAmountChange: (newAmount: string) => void;
	paymentInterval?: PriceCardPaymentInterval;
	otherAmountField?: React.ReactNode;
	hideChooseYourAmount?: boolean;
};

export function PriceCards({
	amounts,
	selectedAmount,
	currency,
	onAmountChange,
	paymentInterval,
	otherAmountField,
	hideChooseYourAmount,
}: PriceCardsProps): JSX.Element {
	// Override hideChooseYourAmount if no amounts supplied
	const enableChooseYourAmountButton = !hideChooseYourAmount || !amounts.length;
	const buttonCount = enableChooseYourAmountButton
		? amounts.length + 1
		: amounts.length;
	const lastButtonFullWidth = buttonCount % 2 !== 0;

	return (
		<div css={cardsContainer}>
			<ChoiceCardGroup
				cssOverrides={getChoiceCardGroupStyles(lastButtonFullWidth)}
				name="amounts"
				columns={2}
			>
				<>
					{amounts.map((amount) => (
						<PriceCard
							amount={amount}
							amountWithCurrency={simpleFormatAmount(
								currencies[currency],
								amount,
							)}
							isSelected={amount === selectedAmount}
							onClick={onAmountChange}
							paymentInterval={paymentInterval}
							alternateLabel={`${simpleFormatAmount(
								currencies[currency],
								amount,
							)}${paymentInterval ? ' per ' + paymentInterval : ''}`}
						/>
					))}
					{enableChooseYourAmountButton && (
						<PriceCard
							amount="other"
							amountWithCurrency="other"
							isSelected={selectedAmount === 'other'}
							onClick={onAmountChange}
							alternateLabel={
								!lastButtonFullWidth ? 'Other' : 'Choose your amount'
							}
						/>
					)}
				</>
			</ChoiceCardGroup>
			{(!hideChooseYourAmount || !amounts.length) && otherAmountField}
		</div>
	);
}
