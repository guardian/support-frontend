import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source-foundations';
import { ChoiceCardGroup } from '@guardian/source-react-components';
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

const otherAmountFullWidthStyles = css`
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
		padding-bottom: ${space[4]}px;
	}
`;

function getChoiceCardGroupStyles(amountOfAmounts: number) {
	if (amountOfAmounts % 2) {
		return [cardStyles, mobileGrid];
	}
	return [cardStyles, otherAmountFullWidthStyles, mobileGrid];
}

export type PriceCardsProps = {
	amounts: string[];
	selectedAmount: string;
	currency: IsoCurrency;
	onAmountChange: (newAmount: string) => void;
	paymentInterval?: PriceCardPaymentInterval;
	otherAmountField?: React.ReactNode;
};

export function PriceCards({
	amounts,
	selectedAmount,
	currency,
	onAmountChange,
	paymentInterval,
	otherAmountField,
}: PriceCardsProps): JSX.Element {
	console.log('RJR: PriceCards - amounts', amounts);

	// RJR: need to find a way to get hideChooseYourAmount attribute into amounts data
	// - or feed it in as an additional prop to the PriceCards component
	const hideChooseYourAmount = Math.random() > 0.5;
	const currentAmountsLen = hideChooseYourAmount
		? amounts.length - 1
		: amounts.length;
	const otherAmountLabel =
		currentAmountsLen % 2 ? 'Other' : 'Choose your amount';

	return (
		<div css={cardsContainer}>
			<ChoiceCardGroup
				cssOverrides={getChoiceCardGroupStyles(currentAmountsLen)}
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
						/>
					))}
					{hideChooseYourAmount ? (
						<></>
					) : (
						<PriceCard
							amount="other"
							amountWithCurrency="other"
							isSelected={selectedAmount === 'other'}
							onClick={onAmountChange}
							alternateLabel={otherAmountLabel}
						/>
					)}
				</>
			</ChoiceCardGroup>
			{otherAmountField}
		</div>
	);
}
