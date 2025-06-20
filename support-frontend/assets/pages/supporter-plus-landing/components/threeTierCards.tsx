import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { CardContent } from './threeTierCard';
import { ThreeTierCard } from './threeTierCard';

export type ThreeTierCardsProps = {
	cardsContent: CardContent[];
	currencyId: IsoCurrency;
	billingPeriod: BillingPeriod;
};

const container = (cardCount: number) => css`
	display: flex;
	flex-direction: column;
	gap: ${space[3]}px;

	> * {
		flex-basis: ${100 / cardCount}%;
	}

	${between.tablet.and.desktop} {
		margin: 0 auto;
		max-width: 340px;
	}

	${from.desktop} {
		gap: ${space[5]}px;
		flex-direction: row;
	}
`;

const cardIndexToTier = (index: number): 1 | 2 | 3 => {
	switch (index) {
		case 1:
			return 2;
		case 2:
			return 3;
		case 0:
		default:
			return 1;
	}
};

export function ThreeTierCards({
	cardsContent,
	currencyId,
	billingPeriod,
}: ThreeTierCardsProps): JSX.Element {
	const haveLabelAndSelectedCards =
		cardsContent.filter((card) => !!card.label || card.isUserSelected).length >
		1;
	let promoCount = 0;
	return (
		<div
			css={container(cardsContent.length)}
			role="tabpanel"
			id={`${billingPeriod}-tab`}
			aria-labelledby={`${billingPeriod}`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				if (cardContent.promotion) {
					promoCount++;
				}
				return (
					<ThreeTierCard
						cardContent={cardContent}
						cardTier={cardIndexToTier(cardIndex)}
						key={`threeTierCard${cardIndex}`}
						promoCount={promoCount}
						isSubdued={haveLabelAndSelectedCards}
						currencyId={currencyId}
						billingPeriod={billingPeriod}
					/>
				);
			})}
		</div>
	);
}
