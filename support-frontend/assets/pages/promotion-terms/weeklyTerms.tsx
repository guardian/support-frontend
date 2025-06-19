import type { CountryGroupName } from '@modules/internationalisation/countryGroup';
import { International } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { Domestic, RestOfWorld } from '@modules/product/fulfilmentOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import { SansParagraph } from 'components/text/text';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { CountryGroupPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';

type NameAndSaving = {
	name: CountryGroupName;
	saving: string | null | undefined;
};
const orderedCountryGroupNames: NameAndSaving[] = [
	{
		name: 'United Kingdom',
		saving: '35%',
	},
	{
		name: 'United States',
		saving: '28%',
	},
	{
		name: 'Australia',
		saving: '29%',
	},
	{
		name: 'Europe',
		saving: '31%',
	},
	{
		name: 'New Zealand',
		saving: '21%',
	},
	{
		name: 'Canada',
		saving: '21%',
	},
	{
		name: 'International',
		saving: null,
	},
];
const shortTermDescription = 'Monthly (4 weeks)';
export default function WeeklyTerms(
	props: PromotionTermsPropTypes,
): JSX.Element {
	return <StandardTerms {...props} />;
}

function getCountryPrice(
	countryGroupName: CountryGroupName,
	prices: CountryGroupPrices,
) {
	const { currency } = CountryGroup.fromCountryGroupName(countryGroupName);
	const currencyGlyph = extendedGlyph(currency);
	const fulfilmentOption =
		countryGroupName === International ? RestOfWorld : Domestic;
	const shortTermPrice =
		prices[fulfilmentOption]?.[NoProductOptions]?.[BillingPeriod.Monthly]?.[
			currency
		];
	const annualPrice =
		prices[fulfilmentOption]?.[NoProductOptions]?.[BillingPeriod.Annual]?.[
			currency
		];
	return {
		currencyGlyph,
		shortTermPrice,
		annualPrice,
	};
}

function getSaving(saving: string | null | undefined) {
	if (saving) {
		return `, saving ${saving} off the cover price.`;
	}

	return '.';
}

function StandardCountryPrice(
	nameAndSaving: NameAndSaving,
	prices: CountryGroupPrices,
) {
	const { shortTermPrice, annualPrice } = getCountryPrice(
		nameAndSaving.name,
		prices,
	);
	return shortTermPrice && annualPrice ? (
		<SansParagraph>
			<strong>{nameAndSaving.name}:</strong> {shortTermDescription} subscription
			rate {showPrice(shortTermPrice)}, or annual rate {showPrice(annualPrice)}
			{getSaving(nameAndSaving.saving)}
		</SansParagraph>
	) : null;
}

function StandardTerms(props: PromotionTermsPropTypes) {
	return (
		<div>
			<SansParagraph>
				Offer subject to availability. Guardian News and Media Limited
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time.
			</SansParagraph>
			<SansParagraph>
				You must be 18+ to be eligible for a Guardian Weekly subscription.
			</SansParagraph>
			{orderedCountryGroupNames.map((nameAndSaving) => {
				const countryGroupPrices = props.productPrices[nameAndSaving.name];

				return countryGroupPrices
					? StandardCountryPrice(nameAndSaving, countryGroupPrices)
					: null;
			})}
		</div>
	);
}
