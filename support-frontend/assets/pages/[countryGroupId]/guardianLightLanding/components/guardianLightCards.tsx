import type { ProductDescription } from 'helpers/productCatalog';

export type GuardianLightCardsProps = {
	cardsContent: Array<{
		link: string;
		productDescription: ProductDescription;
		ctaCopy: string;
	}>;
};

export function GuardianLightCards({
	cardsContent,
}: GuardianLightCardsProps): JSX.Element {
	return (
		<div>
			GuardianLightCards {cardsContent[0].productDescription.label}{' '}
			{cardsContent[1].productDescription.label}
		</div>
	);
}
