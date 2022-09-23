import { css } from '@emotion/react';
import { ChoiceCardGroup } from '@guardian/source-react-components';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import { PriceCard } from './priceCard';

const cardStyles = css`
	label {
		border-radius: 10px;
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
		<ChoiceCardGroup cssOverrides={cardStyles} name="amounts" columns={2}>
			{amounts.map((amount) => (
				<PriceCard
					amount={amount}
					amountWithCurrency={simpleFormatAmount(currencies[currency], amount)}
					isSelected={amount === selectedAmount}
					onClick={onAmountChange}
					paymentInterval={paymentInterval}
				/>
			))}
		</ChoiceCardGroup>
	);
}
