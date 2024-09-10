import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { ContributionCheckoutRedirect } from './components/contributionCheckoutRedirect';
import { OneTimeCheckout } from './oneTimeCheckout';
import { ThankYou } from './thank-you';

setUpTrackingAndConsents();
const appConfig = parseAppConfig(window.guardian);

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
