import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseWindowGuardian } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { ThankYou } from './thank-you';

setUpTrackingAndConsents();

const windowGuardianText =
	document.getElementById('window.guardian')?.innerText;

if (!windowGuardianText) {
	throw new Error('window.guardian not found');
}
const windowGuardianJson: unknown = JSON.parse(windowGuardianText);
const windowGuardian = parseWindowGuardian(windowGuardianJson);
window.guardian = windowGuardian;

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: <Checkout geoId={geoId} />,
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
