import { SvgInfoRound } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupName } from '@modules/internationalisation/countryGroup';
import type {
	FulfilmentOptions,
	PaperFulfilmentOptions,
} from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import {
	getCountryGroup,
	type ProductPrices,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { promotionContainer } from './PrintPromotionStyles';

type PrintPromotionTsAndCsProps = {
	country: IsoCountry;
	paperFulfilment: PaperFulfilmentOptions;
	productPrices: ProductPrices;
	activePaperProducts: ActivePaperProductOptions[];
};

function getPromotionOfferTsAndCsCopy(
	plan: ProductOptions,
	promotion: Promotion,
): JSX.Element {
	const copyEnd = `You can cancel your subscription at any time. Sunday only subscriptions for The Observer are offered by Tortoise Media Ltd. Tortoise Media's terms and conditions and privacy policy will apply.`;
	if (promotion.expires) {
		const endDate = new Date(promotion.expires);
		const copyStart = `Paper:[${plan}] Promotion:[${
			promotion.name
		}] Offer ends ${getDateWithOrdinal(endDate)}.`;
		return (
			<li>
				{copyStart}
				{copyEnd}
			</li>
		);
	}
	return <li>{copyEnd}</li>;
}

function getPromotions(
	country: CountryGroupName,
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: ProductOptions,
	productPrices: ProductPrices,
): Promotion[] | undefined {
	return (
		productPrices[country]?.[paperFulfilment as FulfilmentOptions]?.[
			paperProduct
		]?.Monthly?.GBP?.promotions ?? undefined
	);
}

function getPromoListItem(
	country: CountryGroupName,
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: ProductOptions,
	productPrices: ProductPrices,
): JSX.Element | null {
	const promotions = getPromotions(
		country,
		paperFulfilment,
		paperProduct,
		productPrices,
	);
	console.log('*** promotions', promotions);
	if (promotions) {
		promotions.map((promotion) => {
			return getPromotionOfferTsAndCsCopy(paperProduct, promotion);
		});
	}
	return null;
}

function getAllPromotionTsAndCsCopy(
	country: CountryGroupName,
	paperFulfilment: PaperFulfilmentOptions,
	productPrices: ProductPrices,
	activePaperProducts: ActivePaperProductOptions[],
): JSX.Element {
	return (
		<ul>
			{activePaperProducts
				.filter(
					(paperOption) =>
						paperOption.endsWith('Plus') || paperOption === 'Sunday',
				)
				.map((paperOption) =>
					getPromoListItem(
						country,
						paperFulfilment,
						paperOption,
						productPrices,
					),
				)}
		</ul>
	);
}

export default function PrintPromotionTsAndCs({
	country,
	paperFulfilment,
	productPrices,
	activePaperProducts,
}: PrintPromotionTsAndCsProps): JSX.Element {
	const countryGroup = getCountryGroup(country);
	console.log(
		countryGroup.name,
		paperFulfilment,
		productPrices,
		activePaperProducts,
	);
	return (
		<div css={promotionContainer}>
			<SvgInfoRound size="medium" />
			{getAllPromotionTsAndCsCopy(
				countryGroup.name,
				paperFulfilment,
				productPrices,
				activePaperProducts,
			)}
		</div>
	);
}
