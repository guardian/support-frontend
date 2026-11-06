import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { CardTheme } from 'helpers/landingPage/cardTheme';
import { defaultCardTheme, redCardTheme } from 'helpers/landingPage/cardTheme';
import type { CardContent } from './threeTierCard';
import { ThreeTierCard } from './threeTierCard';

export type ThreeTierCardsProps = {
	cardsContent: CardContent[];
	currencyId: CurrencyCode;
	billingPeriod: BillingPeriod;
	showWeeklyPrice?: boolean;
	deepDiscount?: boolean;
};

// Cards keep the width they have when there are three, so fewer cards (e.g.
// two when the Contribution card is hidden) sit centred instead of stretching.
const minimumColumns = 3;
const desktopGap = space[5];

const container = (cardCount: number) => {
	const columns = Math.max(cardCount, minimumColumns);
	return css`
		display: flex;
		flex-direction: column;
		gap: ${space[3]}px;

		${between.tablet.and.desktop} {
			margin: 0 auto;
			max-width: 340px;
		}

		${from.desktop} {
			gap: ${desktopGap}px;
			flex-direction: row;
			justify-content: center;

			> * {
				flex: 0 1 calc((100% - ${(columns - 1) * desktopGap}px) / ${columns});
			}
		}
	`;
};

// The tier is derived from the product rather than the card's position, so the
// tier-N-button tracking refs stay stable when a card is hidden
// (e.g. ?hideContribution=true).
const productToTier = (product: CardContent['product']): 1 | 2 | 3 => {
	switch (product) {
		case 'SupporterPlus':
			return 2;
		case 'DigitalSubscription':
			return 3;
		case 'Contribution':
		default:
			return 1;
	}
};

export function ThreeTierCards({
	cardsContent,
	currencyId,
	billingPeriod,
	showWeeklyPrice,
	deepDiscount = false,
}: ThreeTierCardsProps): JSX.Element {
	const shouldUseLargePriceMinHeight =
		!!showWeeklyPrice ||
		cardsContent.some((card) => !!card.promotion || !!card.billingPeriodsCopy);
	const haveLabelAndSelectedCards =
		!deepDiscount &&
		cardsContent.filter((card) => !!card.label?.copy || card.isUserSelected)
			.length > 1;
	let promoCount = 0;

	const cardTheme: CardTheme = deepDiscount ? redCardTheme : defaultCardTheme;

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
						cardTheme={cardTheme}
						cardTier={productToTier(cardContent.product)}
						key={`threeTierCard${cardIndex}`}
						promoCount={promoCount}
						isSubdued={haveLabelAndSelectedCards}
						currencyId={currencyId}
						billingPeriod={billingPeriod}
						showWeeklyPrice={showWeeklyPrice}
						useLargePriceMinHeight={shouldUseLargePriceMinHeight}
						deepDiscount={deepDiscount}
					/>
				);
			})}
		</div>
	);
}
