import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from 'react-router-dom';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import type { GeoId } from 'pages/geoIdConfig';
import { geoIds, getGeoIdConfig } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { OneTimeCheckout } from './oneTimeCheckout';
import { ThankYou } from './thank-you';

setUpTrackingAndConsents();
const appConfig = parseAppConfig(window.guardian);

const contributionTypes = ['monthly', 'annual'] as const;
type SelectedContributionType = (typeof contributionTypes)[number];
function isContributionType(val: unknown): val is SelectedContributionType {
	return contributionTypes.includes(val as SelectedContributionType);
}

function getProductFromContributionParams(
	geoId: GeoId,
	productCatalog: AppConfig['productCatalog'],
	urlSearchParams: URLSearchParams,
): {
	product: 'SupporterPlus' | 'Contribution';
	ratePlan: 'Monthly' | 'Annual';
	amount?: number;
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
	if (amount >= supporterPlusAmount) {
		product = 'SupporterPlus';
	} else {
		product = 'Contribution';
	}

	return { product, amount, ratePlan };
}
/** we only export this for testing and shouldn't be coupled/used elsewhere */
export function testGetProductFromContributionParams(
	...args: Parameters<typeof getProductFromContributionParams>
) {
	return getProductFromContributionParams(...args);
}

type ContributionCheckoutRedirectProps = {
	geoId: GeoId;
	productCatalog: AppConfig['productCatalog'];
	urlSearchParams: URLSearchParams;
};
function ContributionCheckoutRedirect({
	geoId,
	productCatalog,
	urlSearchParams,
}: ContributionCheckoutRedirectProps) {
	const { product, ratePlan, amount } =
		getProductFromContributionParams(geoId, productCatalog, urlSearchParams) ??
		{};

	if (!product || !ratePlan || !amount) {
		return null;
	}

	return (
		<Navigate
			to={`/${geoId}/checkout?product=${product}&ratePlan=${ratePlan}${
				product === 'Contribution' ? `&contribution=${amount}` : ''
			}`}
			replace
		/>
	);
}

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		/** `one_off` is excluded for now in controllers.Application.router */
		{
			path: `/${geoId}/contribute/checkout`,
			element: (
				<ContributionCheckoutRedirect
					geoId={geoId}
					productCatalog={appConfig.productCatalog}
					urlSearchParams={new URLSearchParams(window.location.search)}
				/>
			),
		},
		{
			path: `/${geoId}/checkout`,
			element: <Checkout geoId={geoId} appConfig={appConfig} />,
		},
		{
			path: `/${geoId}/one-time-checkout`,
			element: <OneTimeCheckout geoId={geoId} appConfig={appConfig} />,
		},
		{
			path: `/${geoId}/thank-you`,
			element: <ThankYou geoId={geoId} appConfig={appConfig} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
