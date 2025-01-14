import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { GuardianAdLiteLanding } from './guardianAdLiteLanding/guardianAdLiteLanding';
import { OneTimeCheckout } from './oneTimeCheckout';
import { ThankYou } from './thankYou';

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
const appConfig = parseAppConfig(window.guardian);

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: (
				<Checkout
					geoId={geoId}
					appConfig={appConfig}
					abParticipations={abParticipations}
				/>
			),
		},
		{
			path: `/${geoId}/one-time-checkout`,
			element: (
				<OneTimeCheckout
					geoId={geoId}
					appConfig={appConfig}
					abParticipations={abParticipations}
				/>
			),
		},
		{
			path: `/${geoId}/thank-you`,
			element: (
				<ThankYou
					geoId={geoId}
					appConfig={appConfig}
					abParticipations={abParticipations}
				/>
			),
		},
		{
			path: `/${geoId}/guardian-ad-lite`,
			element: <GuardianAdLiteLanding geoId={geoId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
