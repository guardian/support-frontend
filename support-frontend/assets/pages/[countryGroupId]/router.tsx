import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { OneTimeCheckout } from './oneTimeCheckout';
import { OneTimeThankYou } from './oneTimeThankyou';
import { ThankYou } from './thank-you';

setUpTrackingAndConsents();
const appConfig = parseAppConfig(window.guardian);

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
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
		{
			path: `/${geoId}/one-time-thank-you`,
			element: <OneTimeThankYou geoId={geoId} appConfig={appConfig} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
