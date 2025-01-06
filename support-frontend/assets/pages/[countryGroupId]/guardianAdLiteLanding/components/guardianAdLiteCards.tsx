import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import type { ProductDescription } from 'helpers/productCatalog';
import { GuardianAdLiteCard } from './guardianAdLiteCard';

export type GuardianAdLiteCardsProps = {
	cardsContent: Array<{
		link: string;
		productDescription: ProductDescription;
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
		justify-content: center;
	}
`;

export function GuardianAdLiteCards({
	cardsContent,
}: GuardianAdLiteCardsProps): JSX.Element {
	return (
		<div
			css={container(cardsContent.length)}
			role="tabpanel"
			id={`monthly-tab`}
			aria-labelledby={`monthly`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				return <GuardianAdLiteCard cardIndex={cardIndex} {...cardContent} />;
			})}
		</div>
	);
}
