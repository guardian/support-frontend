import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source-foundations';
import type { RegularContributionType } from 'helpers/contributions';
import type { TierBenefits, TierPlanCosts } from '../setup/threeTierConfig';
import { ThreeTierCard } from './threeTierCard';

interface ThreeTierCardsProps {
	cardsContent: Array<{
		title: string;
		isRecommended: boolean;
		isUserSelected: boolean;
		benefits: TierBenefits;
		planCost: TierPlanCosts;
	}>;
	currency: string;
	paymentFrequency: RegularContributionType;
	cardsCtaClickHandler: (price: number) => void;
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

export function ThreeTierCards({
	cardsContent,
	currency,
	paymentFrequency,
	cardsCtaClickHandler,
}: ThreeTierCardsProps): JSX.Element {
	const haveRecommendedAndSelectedCards =
		cardsContent.filter((card) => card.isRecommended || card.isUserSelected)
			.length > 1;

	return (
		<div css={container(cardsContent.length)}>
			{cardsContent.map((cardContent, cardIndex) => {
				return (
					<ThreeTierCard
						key={`threeTierCard${cardIndex}`}
						{...cardContent}
						isRecommendedSubdued={haveRecommendedAndSelectedCards}
						currency={currency}
						paymentFrequency={paymentFrequency}
						cardCtaClickHandler={cardsCtaClickHandler}
					/>
				);
			})}
		</div>
	);
}
