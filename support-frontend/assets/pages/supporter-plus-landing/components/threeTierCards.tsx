import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ProductDescription } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { ThreeTierCard } from './threeTierCard';

export type ThreeTierCardsProps = {
	cardsContent: Array<{
		isRecommended: boolean;
		isUserSelected: boolean;
		link: string;
		productDescription: ProductDescription;
		price: number;
		promotion?: Promotion;
		ctaCopy: string;
	}>;
	currencyId: IsoCurrency;
	countryGroupId: CountryGroupId;
	paymentFrequency: RegularContributionType;
	linkCtaClickHandler: (
		event: React.MouseEvent<HTMLAnchorElement>,
		link: string,
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => void;
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
	countryGroupId,
	paymentFrequency,
	linkCtaClickHandler,
}: ThreeTierCardsProps): JSX.Element {
	const haveRecommendedAndSelectedCards =
		cardsContent.filter((card) => card.isRecommended || card.isUserSelected)
			.length > 1;
	let promoCount = 0;
	return (
		<div
			css={container(cardsContent.length)}
			role="tabpanel"
			id={`${paymentFrequency}-tab`}
			aria-labelledby={`${paymentFrequency}`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				if (cardContent.promotion) {
					promoCount++;
				}
				return (
					<ThreeTierCard
						cardTier={cardIndexToTier(cardIndex)}
						key={`threeTierCard${cardIndex}`}
						promoCount={promoCount}
						{...cardContent}
						isRecommendedSubdued={haveRecommendedAndSelectedCards}
						currencyId={currencyId}
						countryGroupId={countryGroupId}
						paymentFrequency={paymentFrequency}
						linkCtaClickHandler={linkCtaClickHandler}
						ctaCopy={cardContent.ctaCopy}
					/>
				);
			})}
		</div>
	);
}
