import { Navigate } from 'react-router-dom';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';

const contributionTypes = ['monthly', 'annual'] as const;
type SelectedContributionType = (typeof contributionTypes)[number];
function isContributionType(val: unknown): val is SelectedContributionType {
	return contributionTypes.includes(val as SelectedContributionType);
}

export function getProductFromContributionParams(
	geoId: GeoId,
	productCatalog: AppConfig['productCatalog'],
	urlSearchParams: URLSearchParams,
): {
	product: 'SupporterPlus' | 'Contribution';
	ratePlan: 'Monthly' | 'Annual';
	contribution?: number;
} | null {
	const contributionTypeParam = urlSearchParams.get(
		'selected-contribution-type',
	);
	const contributionType = isContributionType(contributionTypeParam)
		? contributionTypeParam
		: undefined;
	const parsedAmountParam = parseInt(
		urlSearchParams.get('selected-amount') ?? '',
		10,
	);
	const amount =
		typeof parsedAmountParam === 'number' ? parsedAmountParam : undefined;

	if (!contributionType || !amount) {
		return null;
	}

	/**
	 * Check if the value is less than the catalog price for SupporterPlus
	 * if it is, it is a Contribution
	 */
	const { currencyKey } = getGeoIdConfig(geoId);
	const ratePlan = contributionType === 'annual' ? 'Annual' : 'Monthly';
	const supporterPlusAmount =
		productCatalog.SupporterPlus.ratePlans[ratePlan].pricing[currencyKey];

	let product: 'SupporterPlus' | 'Contribution';
	let contribution: number | undefined;
	if (amount >= supporterPlusAmount) {
		product = 'SupporterPlus';
		if (amount > supporterPlusAmount) {
			contribution = amount - supporterPlusAmount;
		}
	} else {
		product = 'Contribution';
		contribution = amount;
	}

	return { product, ratePlan, contribution };
}

/**
 * this isn't intended to be used anywhere else bar router.tsx
 * but we have had to put it in it's own file as Ophan doesn't
 * seem to work well with Jest
 */
type Props = {
	geoId: GeoId;
	productCatalog: AppConfig['productCatalog'];
	urlSearchParams: URLSearchParams;
};
export function ContributionCheckoutRedirect({
	geoId,
	productCatalog,
	urlSearchParams,
}: Props) {
	const { product, ratePlan, contribution } =
		getProductFromContributionParams(geoId, productCatalog, urlSearchParams) ??
		{};

	if (!product || !ratePlan) {
		return null;
	}

	return (
		<Navigate
			to={`/${geoId}/checkout?product=${product}&ratePlan=${ratePlan}${
				contribution ? `&contribution=${contribution}` : ''
			}`}
			replace
		/>
	);
}
/** we only export this for testing and shouldn't be coupled/used elsewhere */
export function testGetProductFromContributionParams(
	...args: Parameters<typeof getProductFromContributionParams>
) {
	return getProductFromContributionParams(...args);
}
