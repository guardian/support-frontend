import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source-foundations';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/source-react-components';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
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
	padding-top: ${space[2]}px;
	padding-bottom: ${space[6]}px;

	${from.mobileLandscape} {
		padding-top: ${space[3]}px;
		padding-bottom: 28px;
	}

	${from.tablet} {
		padding-top: ${space[2]}px;
		padding-bottom: 32px;
	}

	${from.desktop} {
		padding-bottom: ${space[9]}px;
	}
`;

export type PriceCardsProps = {
	amounts: string[];
	selectedAmount: string;
	currency: IsoCurrency;
	onAmountChange: (newAmount: string) => void;
	paymentInterval?: 'month' | 'year';
};

export function PriceCards({
	amounts,
	selectedAmount,
	currency,
	onAmountChange,
	paymentInterval,
}: PriceCardsProps): JSX.Element {
	return (
		<ChoiceCardGroup
			cssOverrides={[
				cardStyles,
				otherAmountFullWidthStyles,
				mobileGrid,
				cardsContainer,
			]}
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
				<ChoiceCard
					id="amount-other"
					key="amount-other"
					name="amount"
					onChange={() => onAmountChange('other')}
					value="other"
					label="Choose your amount"
				/>
			</>
		</ChoiceCardGroup>
	);
}
