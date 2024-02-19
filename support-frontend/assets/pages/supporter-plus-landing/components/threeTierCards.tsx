import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source-foundations';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { TierBenefits, TierPlanCosts } from '../setup/threeTierConfig';
import { ThreeTierCard } from './threeTierCard';

interface ThreeTierCardsProps {
	cardsContent: Array<{
		title: string;
		isRecommended: boolean;
		isUserSelected: boolean;
		benefits: TierBenefits;
		planCost: TierPlanCosts;
		externalBtnLink?: string;
	}>;
	currencyId: IsoCurrency;
	paymentFrequency: RegularContributionType;
	buttonCtaClickHandler: (
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => void;
	linkCtaClickHandler: (
		price: number,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => void;
}

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
	buttonCtaClickHandler,
	linkCtaClickHandler,
}: ThreeTierCardsProps): JSX.Element {
	const haveRecommendedAndSelectedCards =
		cardsContent.filter((card) => card.isRecommended || card.isUserSelected)
			.length > 1;

	return (
		<div
			css={container(cardsContent.length)}
			role="tabpanel"
			id={`${paymentFrequency}-tab`}
			aria-labelledby={`${paymentFrequency}`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				return (
					<ThreeTierCard
						cardTier={cardIndexToTier(cardIndex)}
						key={`threeTierCard${cardIndex}`}
						{...cardContent}
						isRecommendedSubdued={haveRecommendedAndSelectedCards}
						currencyId={currencyId}
						paymentFrequency={paymentFrequency}
						buttonCtaClickHandler={buttonCtaClickHandler}
						linkCtaClickHandler={linkCtaClickHandler}
					/>
				);
			})}
		</div>
	);
}
