import React from 'react';
import { SansParagraph } from 'components/text/text';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import {
	fromCountryGroupName,
	International,
} from 'helpers/internationalisation/countryGroup';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
	Annual,
	postIntroductorySixForSixBillingPeriod,
	Quarterly,
} from 'helpers/productPrice/billingPeriods';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { CountryGroupPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
type NameAndSaving = {
	name: CountryGroupName;
	saving: string | null | undefined;
};
const orderedCountryGroupNames: NameAndSaving[] = [
	{
		name: 'United Kingdom',
		saving: '34%',
	},
	{
		name: 'United States',
		saving: '34%',
	},
	{
		name: 'Australia',
		saving: '30%',
	},
	{
		name: 'Europe',
		saving: '30%',
	},
	{
		name: 'New Zealand',
		saving: '19%',
	},
	{
		name: 'Canada',
		saving: '30%',
	},
	{
		name: 'International',
		saving: null,
	},
];
const shortTermDescription =
	postIntroductorySixForSixBillingPeriod === Quarterly
		? 'Quarterly (13 weeks)'
		: 'Monthly (4 weeks)';
export default function WeeklyTerms(props: PromotionTermsPropTypes) {
	const includes6For6 =
		props.promotionTerms.productRatePlans.filter((ratePlan) =>
			ratePlan.includes('6 for 6'),
		).length > 0;

	if (includes6For6) {
		return <SixForSix {...props} />;
	}

	return <StandardTerms {...props} />;
}

function getCountryPrice(
	countryGroupName: CountryGroupName,
	prices: CountryGroupPrices,
) {
	const { currency } = fromCountryGroupName(countryGroupName);
	const currencyGlyph = extendedGlyph(currency);
	const fulfilmentOption =
		countryGroupName === International ? RestOfWorld : Domestic;
	const shortTermPrice =
		prices[fulfilmentOption][NoProductOptions][
			postIntroductorySixForSixBillingPeriod
		][currency];
	const annualPrice =
		prices[fulfilmentOption][NoProductOptions][Annual][currency];
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
	return (
		<SansParagraph>
			<strong>{nameAndSaving.name}:</strong> {shortTermDescription} subscription
			rate {showPrice(shortTermPrice)}, or annual rate {showPrice(annualPrice)}
			{getSaving(nameAndSaving.saving)}
		</SansParagraph>
	);
}

function SixForSixCountryPrice(
	nameAndSaving: NameAndSaving,
	prices: CountryGroupPrices,
) {
	const { currencyGlyph, shortTermPrice } = getCountryPrice(
		nameAndSaving.name,
		prices,
	);
	return (
		<SansParagraph>
			<strong>{nameAndSaving.name}:</strong> Offer is {currencyGlyph}6 for the
			first 6 issues followed by {shortTermDescription.toLowerCase()}
			subscription payments of {showPrice(shortTermPrice)} thereafter
			{getSaving(nameAndSaving.saving)}
		</SansParagraph>
	);
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
			{orderedCountryGroupNames.map((nameAndSaving) =>
				StandardCountryPrice(
					nameAndSaving,
					props.productPrices[nameAndSaving.name],
				),
			)}
		</div>
	);
}

function SixForSix(props: PromotionTermsPropTypes) {
	return (
		<div>
			<SansParagraph>
				Offer subject to availability. Guardian News and Media Limited
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time.
			</SansParagraph>
			<SansParagraph>
				Offer not available to current subscribers of Guardian Weekly. You must
				be 18+ to be eligible for this offer. Guardian Weekly reserve the right
				to end this offer at any time.
			</SansParagraph>
			{orderedCountryGroupNames.map((nameAndSaving) =>
				SixForSixCountryPrice(
					nameAndSaving,
					props.productPrices[nameAndSaving.name],
				),
			)}
		</div>
	);
}
