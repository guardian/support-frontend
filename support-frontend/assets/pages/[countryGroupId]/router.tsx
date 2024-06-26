import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
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
			path: `/${geoId}/thank-you`,
			element: <ThankYou geoId={geoId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
