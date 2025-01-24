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
	isSignedIn?: boolean;
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
const containerExpand = css`
	padding-bottom: ${space[6]}px;
	${from.tablet} {
		padding-bottom: ${space[9]}px;
	}
`;

export function GuardianAdLiteCards({
	cardsContent,
	isSignedIn,
}: GuardianAdLiteCardsProps): JSX.Element {
	console.log('*** IsSignedIn', isSignedIn);
	return (
		<div
			css={[
				container(cardsContent.length),
				!isSignedIn ? containerExpand : css``,
			]}
			role="tabpanel"
			id={`monthly-tab`}
			aria-labelledby={`monthly`}
		>
			{cardsContent.map((cardContent, cardIndex) => {
				return (
					<GuardianAdLiteCard
						cardIndex={cardIndex}
						key={`guardianAdLite${cardIndex}`}
						{...cardContent}
					/>
				);
			})}
		</div>
	);
}
