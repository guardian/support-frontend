import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { GuardianLightLanding } from './guardianLightLanding/guardianLightLanding';
import { OneTimeCheckout } from './oneTimeCheckout';
import { ThankYou } from './thankYou';

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
			path: `/${geoId}/guardian-light`,
			element: <GuardianLightLanding geoId={geoId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
