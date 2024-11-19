import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type { ProductDescription } from 'helpers/productCatalog';
import { ThreeTierCard } from 'pages/supporter-plus-landing/components/threeTierCard';

export type GuardianLightCardsProps = {
	cardsContent: Array<{
		link: string;
		productDescription: ProductDescription;
		price: number;
		ctaCopy: string;
	}>;
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

const cardIndexToTier = (index: number): 1 | 2 => {
	switch (index) {
		case 1:
			return 2;
		case 0:
		default:
			return 1;
	}
};

export function GuardianLightCards({
	cardsContent,
}: GuardianLightCardsProps): JSX.Element {
	return (
		<div
			css={container(cardsContent.length)}
			role="tabpanel"
			id={`monthly-tab`}
			aria-labelledby={`monthly`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				return (
					<ThreeTierCard
						isRecommended={false}
						isUserSelected={false}
						cardTier={cardIndexToTier(cardIndex)}
						key={`guardianLightCard${cardIndex}`}
						promoCount={0}
						{...cardContent}
						isRecommendedSubdued={false}
						currencyId={'GBP'}
						countryGroupId={'GBPCountries'}
						paymentFrequency={'MONTHLY'}
						ctaCopy={cardContent.ctaCopy}
					/>
				);
			})}
		</div>
	);
}
