import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type { Participations } from 'helpers/abTests/models';
import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { LandingPageProductDescription } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { ThreeTierCard } from './threeTierCard';

export type CardContent = LandingPageProductDescription & {
	isUserSelected: boolean;
	link: string;
	price: number;
	promotion?: Promotion;
};

export type ThreeTierCardsProps = {
	cardsContent: CardContent[];
	currencyId: IsoCurrency;
	countryGroupId: CountryGroupId;
	paymentFrequency: RegularContributionType;
	abParticipations?: Participations;
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
	paymentFrequency,
}: ThreeTierCardsProps): JSX.Element {
	const haveLabelAndSelectedCards =
		cardsContent.filter((card) => !!card.label || card.isUserSelected).length >
		1;
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
						link={cardContent.link}
						promoCount={promoCount}
						price={cardContent.price}
						promotion={cardContent.promotion}
						productDescription={cardContent}
						isSubdued={haveLabelAndSelectedCards}
						currencyId={currencyId}
						paymentFrequency={paymentFrequency}
						ctaCopy={cardContent.cta.copy}
						lozengeText={cardContent.label?.copy}
					/>
				);
			})}
		</div>
	);
}
