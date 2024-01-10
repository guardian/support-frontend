import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source-foundations';
import type { RegularContributionType } from 'helpers/contributions';
import type { PlanCosts, TierBenefits } from '../setup/threeTierConfig';
import { ThreeTierCard } from './threeTierCard';

interface ThreeTierCardsProps {
	cardsContent: Array<{
		title: string;
		isRecommended?: true;
		benefits: TierBenefits;
		planCost: PlanCosts;
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
	return (
		<div css={container(cardsContent.length)}>
			{cardsContent.map((cardContent, cardIndex) => {
				return (
					<ThreeTierCard
						key={`threeTierCard${cardIndex}`}
						{...cardContent}
						currency={currency}
						paymentFrequency={paymentFrequency}
						cardCtaClickHandler={cardsCtaClickHandler}
					/>
				);
			})}
		</div>
	);
}
