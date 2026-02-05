import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getCountryGroup } from 'helpers/productPrice/productPrices';

const pricesSection = css`
	color: ${neutral[100]};
`;

const pricesHeadline = css`
	${headlineBold24};
	${from.tablet} {
		font-size: 34px;
	}
`;

const pricesSubHeadline = css`
	${textEgyptian17};
	padding-bottom: ${space[4]}px 0;
`;

const priceCardsContainer = css`
	margin: ${space[10]}px 0 ${space[8]}px;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border-radius: ${space[2]}px;
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
`;

type WeeklyCardsProps = {
	countryId: IsoCountry;
	productPrices: ProductPrices;
};

export function WeeklyCards({
	countryId,
	productPrices,
}: WeeklyCardsProps): JSX.Element {
	const countryGroup = getCountryGroup(countryId);
	const productPrice =
		productPrices[countryGroup.name]?.Domestic?.NoProductOptions?.Annual?.[
			countryGroup.currency
		];
	const sampleWeeklyCardsCopy = `PRICE CARDS COMPONENT Annual=>${productPrice?.currency}${productPrice?.price}`;
	return (
		<section css={pricesSection} id="subscribeWeekly">
			<h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
			<p css={pricesSubHeadline}>Choose how you'd like to pay</p>
			<div css={priceCardsContainer}>{sampleWeeklyCardsCopy}</div>
		</section>
	);
}
